"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { HttpError } from "@/types/axios/httpError.t";
import { useUserStore } from "@/store/userStore";
import { useNotificationStore } from "@/store/notificationStore";

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
  const { setMessage } = useNotificationStore();

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
   * 2. 입력값이 6자리가 아닌 경우 즉시 에러 표시
   * 3. 서버에 familyOtp 검증 요청
   * 4. 성공 시 /home 페이지로 이동
   * 5. 실패 시 에러 메시지 표시
   */
  const submit = useCallback(async () => {
    if (!enabled) return;

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

      const res = await api.post(requests.verifyFamilyOtp, body);

      /** 검증 성공 */
      setMessage("가족 등록에 성공했습니다.");
      router.push("/home");
    } catch (err: any) {
      /** 서버 오류 */
      setInputError(true);

      const status = err.response?.status;

      if (status === 400) {
        setDialogText("코드가 일치하지 않습니다\n다시 입력해주세요");
      } else if (status === 410) {
        setDialogText("만료된 코드입니다\n새로운 코드를 발급받으세요");
      } else {
        setDialogText(
          err instanceof HttpError
            ? err.message
            : "인증에 실패했습니다.\n다시 시도해주세요."
        );
      }
      setDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [enabled, value, router, userId]);

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
  };
};
