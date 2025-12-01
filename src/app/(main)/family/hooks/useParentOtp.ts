// src/app/(main)/family/hooks/useParentOtp.ts
"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { HttpError } from "@/types/axios/httpError.t";

/**
 * useParentOtp
 *
 * 부모 사용자(PARENT)의 가족 등록 OTP 생성/조회 로직을 관리하는 커스텀 훅입니다.
 *
 * ### 주요 기능
 * - 가족등록 OTP 요청(fetch)
 * - 중복 요청 방지 (요청 중 다시 불리지 않도록 ref 사용)
 * - 로딩 상태/오류 상태 관리
 * - 페이지 이동(`/home`) 제공
 * - 부모 사용자 상태일 때만 훅 동작
 * - 1분마다 자동 갱신
 * - OTP 생성 시간 및 남은 시간 추적
 *
 * ### 동작 흐름
 * 1. `enabled === true`일 경우 컴포넌트 마운트 시 즉시 OTP 요청 수행
 * 2. `fetchOtp()`로 새로운 OTP 다시 요청 가능
 * 3. 요청 중에는 추가 fetch를 무시 (중복 호출 방지)
 * 4. 실패 시 `error` 문자열로 메시지 표시
 * 5. OTP 발급 후 1분마다 자동 갱신
 *
 * ### 사용 예시
 * ```tsx
 * const { otp, refresh, isLoading, error, goHome, timeRemaining } = useParentOtp(isParent);
 *
 * <OtpDisplay otp={otp} timeRemaining={timeRemaining} />
 * <button onClick={refresh}>새로고침</button>
 * <BigButtonActivated onClick={goHome} label="확인" />
 * ```
 *
 * @param {boolean} enabled - 부모 사용자 여부. true일 때만 OTP 요청이 수행됩니다.
 *
 * @returns {{
 *   otp: string | null;
 *   isLoading: boolean;
 *   error: string | null;
 *   refresh: () => Promise<void>;
 *   goHome: () => void;
 *   timeRemaining: number;
 * }}
 *
 * 반환 객체 설명:
 * - `otp`: 서버에서 발급받은 6자리 OTP 문자열 (없으면 null)
 * - `isLoading`: OTP 요청 중 여부
 * - `error`: 오류 메시지
 * - `refresh`: OTP 재요청 함수
 * - `goHome`: `/home`으로 이동하는 helper 함수
 * - `timeRemaining`: 남은 시간(초)
 */
export const useParentOtp = (enabled: boolean) => {
  const router = useRouter();

  /** 서버로부터 받아온 OTP */
  const [otp, setOtp] = useState<string | null>(null);

  /** OTP 요청 중인지 여부 */
  const [isLoading, setIsLoading] = useState(false);

  /** 서버 오류 메시지 */
  const [error, setError] = useState<string | null>(null);

  /** OTP 생성 시간 */
  const [otpCreatedAt, setOtpCreatedAt] = useState<Date | null>(null);

  /** 남은 시간(초) */
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  /**
   * 중복 요청 방지 플래그
   * - 요청이 끝나기 전까지 true
   */
  const isRequestingRef = useRef(false);

  /** 자동 갱신 타이머 ref */
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  /** 시간 업데이트 타이머 ref */
  const timeUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * OTP 요청 API 호출
   *
   * - 중복 요청 방지
   * - 성공 시 OTP 저장 및 생성 시간 기록
   * - 실패 시 에러 메시지 저장
   */
  const fetchOtp = useCallback(async () => {
    if (!enabled || isRequestingRef.current) return;

    isRequestingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get<{ familyOtp: number }>(
        requests.verifyFamilyOtp
      );
      const newOtp = res.data.familyOtp.toString();
      setOtp(newOtp);
      setOtpCreatedAt(new Date());
      setTimeRemaining(60);
    } catch (err) {
      setOtp(null);
      setOtpCreatedAt(null);
      setError(err instanceof HttpError ? err.message : "OTP 요청 실패");
    } finally {
      isRequestingRef.current = false;
      setIsLoading(false);
    }
  }, [enabled]);

  /**
   * enabled가 true인 경우 컴포넌트 마운트 시 OTP 자동 호출
   */
  useEffect(() => {
    if (enabled) fetchOtp();
  }, [enabled, fetchOtp]);

  /**
   * 1분마다 자동 갱신
   */
  useEffect(() => {
    if (!enabled || !otp) return;

    // 기존 타이머 정리
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }

    // 1분(60초) 후 자동 갱신
    autoRefreshTimerRef.current = setTimeout(() => {
      fetchOtp();
    }, 60000);

    return () => {
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current);
      }
    };
  }, [enabled, otp, fetchOtp]);

  /**
   * 남은 시간 업데이트 (1초마다)
   */
  useEffect(() => {
    if (!enabled || !otpCreatedAt) {
      setTimeRemaining(60);
      return;
    }

    // 기존 타이머 정리
    if (timeUpdateTimerRef.current) {
      clearInterval(timeUpdateTimerRef.current);
    }

    // 1초마다 남은 시간 계산
    timeUpdateTimerRef.current = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor(
        (now.getTime() - otpCreatedAt.getTime()) / 1000
      );
      const remaining = Math.max(0, 60 - elapsed);
      setTimeRemaining(remaining);

      // 시간이 0이 되면 타이머 정리
      if (remaining === 0) {
        if (timeUpdateTimerRef.current) {
          clearInterval(timeUpdateTimerRef.current);
        }
      }
    }, 1000);

    return () => {
      if (timeUpdateTimerRef.current) {
        clearInterval(timeUpdateTimerRef.current);
      }
    };
  }, [enabled, otpCreatedAt]);

  return {
    otp,
    isLoading,
    error,
    refresh: fetchOtp,
    goHome: () => router.push("/home"),
    timeRemaining,
  };
};
