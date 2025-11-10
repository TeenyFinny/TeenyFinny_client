// app/(no-footer)/login/useLoginForm.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { HttpError } from "@/types/axios/httpError.t";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @module useLoginForm
 * @description
 * 로그인 페이지의 폼 상태와 제출 로직을 관리하는 커스텀 훅입니다.
 *
 * 주요 역할:
 * - 이메일/비밀번호 입력값 상태 관리
 * - 유효성 검사 수행
 * - 로그인 API 요청 및 예외 처리
 * - 로그인 성공 시 사용자 상태(Zustand) 갱신 및 라우팅 이동
 *
 * @returns {{
 *   email: string; # 입력 중인 이메일
 *   password: string; # 입력 중인 비밀번호
 *   error: string | null; # 에러 메시지 문자열 (없을 경우 null)
 *   isSubmitting: boolean; # 요청 진행 중 여부
 *   handleEmailChange: (value: string) => void; # 이메일 입력 핸들러
 *   handlePasswordChange: (value: string) => void; # 비밀번호 입력 핸들러
 *   handleSubmit: () => Promise<void>; # 로그인 요청 핸들러러
 * }}
 */
export function useLoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 이메일 입력 이벤트 핸들러.
   * 입력 시 기존 에러 메시지를 초기화합니다.
   * @param value - 입력된 이메일 문자열
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
  };

  /**
   * 비밀번호 입력 이벤트 핸들러.
   * 입력 시 기존 에러 메시지를 초기화합니다.
   * @param value - 입력된 비밀번호 문자열
   */
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
  };

  /**
   * 입력값 유효성 검증.
   * 이메일 형식 및 필수 입력 여부를 검사합니다.
   * @returns {boolean} 유효하면 true, 그렇지 않으면 false
   */
  const validate = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("유효한 이메일 형식이 아닙니다.");
      return false;
    }
    return true;
  };

  /**
   * 로그인 요청 처리 함수.
   * 1. 입력 검증 통과 시 axios 요청 수행
   * 2. 로그인 성공 시 Zustand 상태 갱신 및 `/home`으로 이동
   * 3. 실패 시 에러 메시지 상태 갱신
   */
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post(requests.login, {
        email: email.trim(),
        password: password.trim(),
      });

      const { user } = res.data;
      if (!user) {
        throw new HttpError({
          message: "서버 응답이 올바르지 않습니다.",
          statusCode: res.status,
        });
      }

      const role = user.role?.toLowerCase();
      if (role !== "parent" && role !== "child") {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "서버로부터 받은 사용자 역할이 유효하지 않습니다.",
            role
          );
        }
        throw new HttpError({
          message: "잘못된 요청입니다. 관리자에게 문의해주세요.",
          statusCode: res.status,
        });
      }

      // 상태 갱신 (Zustand)
      setUser(
        user.name,
        user.role.toLowerCase() as "parent" | "child",
        Array.isArray(user.children) && user.children.length > 0
      );

      // 로그인 성공 후 홈으로 이동
      router.replace("/home");
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message || "로그인에 실패했습니다.");
      } else if (err instanceof Error) {
        setError("예기치 못한 오류가 발생했습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, isSubmitting, setUser, router]);

  return {
    email,
    password,
    error,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
}
