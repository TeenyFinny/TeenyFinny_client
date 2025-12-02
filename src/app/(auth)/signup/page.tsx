"use client";

import { useRegisterStore } from "@/store/registerStore";
import { useRegisterStep } from "./useRgisterStep";
import Step01Terms from "./Step01Terms";
import Step02Roles from "./Step02Roles";
import Step03Verification from "./Step03Verification";
import Step04UserInfo from "./Step04UserInfo";
import Step05PasswordInstruction from "./Step05PasswordInstruction";
import Step06SimplePassword from "./Step06SimplePassword";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import { saveAuthToken } from "@/lib/auth/token";
import { useUserStore } from "@/store/userStore";

/**
 * RegisterPage
 *
 * 회원가입 플로우의 단계별 화면을 렌더링하는 페이지입니다.
 * - 단계 전환: RegisterStepProvider Context를 사용합니다.
 * - 입력 상태: useRegisterStore
 */
export default function RegisterPage() {
  const router = useRouter();
  const { step, next } = useRegisterStep();
  const { form, setField, reset } = useRegisterStore();
  const [password, setPassword] = useState("");
  const setUser = useUserStore((state) => state.setUser);

  /** 모달 상태 */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 회원가입 POST 요청 */
  const handleSignup = async (simplePassword: string) => {
    // 중복 실행 방지
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 카카오 회원가입 여부 확인
      const isKakaoSignup =
        sessionStorage.getItem("is-kakao-signup") === "true";
      const kakaoTempToken = sessionStorage.getItem("kakao-temp-token");

      let res;

      if (isKakaoSignup && kakaoTempToken) {
        // 카카오 회원가입
        // birthDate를 YYYY-MM-DD 형식으로 변환
        let formattedBirthDate = form.birthDate;
        if (form.birthDate.length === 8) {
          formattedBirthDate = `${form.birthDate.slice(
            0,
            4
          )}-${form.birthDate.slice(4, 6)}-${form.birthDate.slice(6, 8)}`;
        }

        const payload = {
          tempToken: kakaoTempToken,
          role: form.role,
          name: form.name,
          email: form.email, // 이메일 추가
          birthDate: formattedBirthDate,
          gender: form.gender,
          phoneNumber: form.phoneNumber,
          simplePassword: String(simplePassword),
        };

        // 카카오 회원가입은 백엔드에서 토큰을 반환함
        res = await api.post(requests.kakaoSignup, payload);

        // 카카오 관련 세션 정리
        sessionStorage.removeItem("kakao-temp-token");
        sessionStorage.removeItem("kakao-email");
        sessionStorage.removeItem("kakao-name");
        sessionStorage.removeItem("is-kakao-signup");
      } else {
        // 일반 회원가입
        const payload = {
          email: form.email,
          password,
          name: form.name,
          role: form.role,
          simplePassword: String(simplePassword),
          birthDate: form.birthDate,
          gender: form.gender,
          phoneNumber: form.phoneNumber,
        };

        // 회원가입 요청만 수행 (로그인은 완료 페이지에서 처리)
        await api.post(requests.signup, payload);
        res = null; // 로그인 요청 제거
      }

      // 완료 페이지로 이동하면서 이메일, 비밀번호, 역할 전달
      if (isKakaoSignup) {
        // 카카오 회원가입인 경우 토큰은 이미 받았으므로 그대로 사용
        // 응답 형식 확인: res.data.data 또는 res.data
        const payload = res?.data?.data || res?.data;
        if (payload) {
          const { user, tokenType, accessToken } = payload;
          if (user && tokenType && accessToken) {
            saveAuthToken(tokenType, accessToken);

            // role을 소문자로 변환하여 저장
            const userRole = user.role?.toLowerCase();
            if (userRole === "parent" || userRole === "child") {
              setUser(
                user.name,
                userRole,
                user.userId,
                Array.isArray(user.children) && user.children.length > 0
              );
            }
          }
        }
        if (globalThis.window !== undefined && form.role) {
          globalThis.window.sessionStorage.setItem(
            "signup-complete-role",
            form.role
          );
        }
        sessionStorage.removeItem("register-form-storage");
        reset();
        router.push("/signup/complete");
        return;
      }

      // 일반 회원가입인 경우에만 이메일과 비밀번호를 쿼리 파라미터로 전달
      const params = new URLSearchParams({
        email: form.email,
        password: password,
        role: form.role || "",
      });
      reset();
      router.push(`/signup/complete?${params.toString()}`);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("회원가입 요청 실패:", error);
      }
      setModalMessage("서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
      setModalOpen(true);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="px-6 flex flex-col items-center">
      <div className="w-full max-w-[327px]">
        {/* Step 1: 약관 동의 */}
        {step === 1 && (
          <Step01Terms
            terms={form.terms}
            onChange={(updatedTerms) => setField("terms", updatedTerms)}
            onNext={next}
          />
        )}

        {/* Step 2: 역할 선택 */}
        {step === 2 && (
          <Step02Roles
            selectedRole={form.role ?? null}
            onSelect={(role) => setField("role", role)}
            onNext={next}
          />
        )}
        {/* Step 3: 본인인증 */}
        {step === 3 && <Step03Verification onNext={next} />}
        {/* Step 4: 회원가입 폼 */}
        {step === 4 && (
          <Step04UserInfo
            onNext={(userPassword) => {
              setPassword(userPassword);
              next();
            }}
          />
        )}
        {/* Step 5: 간편 비밀번호 안내 */}
        {step === 5 && <Step05PasswordInstruction onNext={next} />}
        {/* Step 6: 간편비밀번호 입력 완료 시 POST 요청 */}
        {step === 6 && (
          <Step06SimplePassword
            onComplete={(simplePassword) => handleSignup(simplePassword)}
          />
        )}
      </div>

      {/* 회원가입 실패 시 모달 */}
      <TitleOnlyDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalMessage}
        confirmText="확인"
        onConfirm={() => setModalOpen(false)}
      />
    </main>
  );
}
