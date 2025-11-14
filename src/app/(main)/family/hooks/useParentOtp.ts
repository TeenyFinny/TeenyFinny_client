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
 *
 * ### 동작 흐름
 * 1. `enabled === true`일 경우 컴포넌트 마운트 시 즉시 OTP 요청 수행
 * 2. `fetchOtp()`로 새로운 OTP 다시 요청 가능
 * 3. 요청 중에는 추가 fetch를 무시 (중복 호출 방지)
 * 4. 실패 시 `error` 문자열로 메시지 표시
 *
 * ### 사용 예시
 * ```tsx
 * const { otp, refresh, isLoading, error, goHome } = useParentOtp(isParent);
 *
 * <OtpDisplay otp={otp} />
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
 * }}
 *
 * 반환 객체 설명:
 * - `otp`: 서버에서 발급받은 6자리 OTP 문자열 (없으면 null)
 * - `isLoading`: OTP 요청 중 여부
 * - `error`: 오류 메시지
 * - `refresh`: OTP 재요청 함수
 * - `goHome`: `/home`으로 이동하는 helper 함수
 */
export const useParentOtp = (enabled: boolean) => {
  const router = useRouter();

  /** 서버로부터 받아온 OTP */
  const [otp, setOtp] = useState<string | null>(null);

  /** OTP 요청 중인지 여부 */
  const [isLoading, setIsLoading] = useState(false);

  /** 서버 오류 메시지 */
  const [error, setError] = useState<string | null>(null);

  /**
   * 중복 요청 방지 플래그
   * - 요청이 끝나기 전까지 true
   */
  const isRequestingRef = useRef(false);

  /**
   * OTP 요청 API 호출
   *
   * - 중복 요청 방지
   * - 성공 시 OTP 저장
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
      setOtp(res.data.familyOtp.toString());
    } catch (err) {
      setOtp(null);
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

  return {
    otp,
    isLoading,
    error,
    refresh: fetchOtp,
    goHome: () => router.push("/home"),
  };
};
