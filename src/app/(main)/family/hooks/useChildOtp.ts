"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { HttpError } from "@/types/axios/httpError.t";
import { useUserStore } from "@/store/userStore";

/**
 * useChildOtp
 *
 * 자녀 사용자(CHILD)의 가족등록 OTP 입력 및 검증 로직을 담당하는 커스텀 훅입니다.
 *
 * ### 주요 기능
 * - 6자리 OTP 입력값 상태 관리
 * - 입력값 변경 시 에러 초기화
 * - 6자리 미만인 경우 즉시 에러 표시
 * - 서버로 OTP 검증 요청
 * - 검증 성공 시 `/home`으로 이동
 * - 요청 중 로딩 상태 관리
 * @param {boolean} enabled - 이 훅이 동작해야 하는지 여부 (자녀 사용자일 때만 true)
 * @returns {{
 *   value: string;
 *   onChange: (v: string) => void;
 *   error: string | null;
 *   inputError: boolean;
 *   isSubmitting: boolean;
 *   submit: () => Promise<void>;
 * }}
 * 반환 객체:
 * - `value`: 입력된 OTP 전체 문자열
 * - `onChange`: OTP 변경 핸들러
 * - `error`: 서버 오류 또는 입력 오류 메시지
 * - `inputError`: OTP 각 칸 인풋에 에러 스타일을 표시할지 여부
 * - `isSubmitting`: 인증 요청 중 여부
 * - `submit`: OTP 서버 검증 요청 실행 함수
 */
export const useChildOtp = (enabled: boolean) => {
  const router = useRouter();
  const { userId } = useUserStore();

  /** 입력된 OTP 숫자 (최대 6자리) */
  const [value, setValue] = useState("");

  /** 각 칸 인풋 에러 스타일 적용 여부 */
  const [inputError, setInputError] = useState(false);

  /** 서버 오류 또는 입력 오류 메시지 */
  const [error, setError] = useState<string | null>(null);

  /** OTP 검증 요청 중 상태 */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 모달 제어 */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  /** 시도 횟수 (최대 5회) */
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 5;

  /**
   * OTP 변경 핸들러
   * - 입력 시 전체 문자열 업데이트
   * - 기존 에러 초기화
   *
   * @param {string} v - 변경된 OTP 값
   */
  const onChange = (v: string) => {
    setValue(v);
    setInputError(false);
    setError(null);
  };

  /**
   * OTP 검증 요청
   *
   * 1. enabled가 false이면 실행하지 않음
   * 2. 시도 횟수 확인 (최대 5회)
   * 3. 입력값이 6자리가 아닌 경우 즉시 에러 표시
   * 4. 서버에 familyOtp 검증 요청
   * 5. 성공 시 /home 페이지로 이동
   * 6. 실패 시 에러 메시지 표시 및 시도 횟수 증가
   */
  const submit = useCallback(async () => {
    if (!enabled) return;

    // 시도 횟수 초과 확인
    if (attemptCount >= MAX_ATTEMPTS) {
      setInputError(true);
      setDialogText(`시도 횟수를 초과했습니다.\n(최대 ${MAX_ATTEMPTS}회)`);
      setDialogOpen(true);
      return;
    }

    // 6자리 미완성 입력
    if (value.length !== 6) {
      setInputError(true);
      setError("6자리 인증 번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        userId,
        role: "CHILD" as const,
        familyOtp: Number(value),
      };

      await api.post(requests.verifyFamilyOtp, body);

      /** 검증 성공 */
      // 가족 등록 완료 시 hasFamily 플래그 제거
      sessionStorage.removeItem("hasFamily");

      // 알림은 SSE를 통해 서버에서 자동으로 전송됨 (useSse에서 setMessage(data.content) 호출)
      // 부모와 동일하게 SSE를 통해 알림을 받음

      // /home으로 이동 (SSE를 통해 받은 알림은 /home 페이지에서 PushNotification으로 표시됨)
      router.push("/home");
    } catch (err: any) {
      /** 서버 오류 */
      setInputError(true);

      // 시도 횟수 증가
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (err instanceof HttpError) {
        const { statusCode } = err;
        if (statusCode === 400) {
          const remainingAttempts = MAX_ATTEMPTS - newAttemptCount;
          if (remainingAttempts > 0) {
            setDialogText(
              `코드가 일치하지 않습니다\n다시 입력해주세요\n(남은 시도: ${remainingAttempts}회)`
            );
          } else {
            setDialogText(
              `코드가 일치하지 않습니다\n시도 횟수를 초과했습니다.\n(최대 ${MAX_ATTEMPTS}회)`
            );
          }
        } else if (statusCode === 410) {
          setDialogText("만료된 코드입니다\n새로운 코드를 발급받으세요");
        } else {
          setDialogText(
            err.message || "인증에 실패했습니다.\n다시 시도해주세요."
          );
        }
      } else {
        setDialogText("인증에 실패했습니다.\n다시 시도해주세요.");
      }
      setDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [enabled, value, router, userId, attemptCount]);

  return {
    value,
    onChange,
    error,
    inputError,
    isSubmitting,
    submit,
    dialogOpen,
    setDialogOpen,
    dialogText,
    attemptCount,
    maxAttempts: MAX_ATTEMPTS,
    remainingAttempts: MAX_ATTEMPTS - attemptCount,
  };
};
