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

  /** 모달 상태 */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  /** 회원가입 POST 요청 */
  const handleSignup = async (simplePassword: string) => {
    try {
      // 요청 payload
      const payload = {
        email: form.email,
        password,
        name: form.name,
        role: form.role,
        simplePassword: simplePassword,
        birthDate: form.birthDate,
        gender: form.gender,
        phoneNumber: form.phoneNumber,
      };

      const res = await api.post(requests.signup, payload);
      if (res?.data?.email && res?.data?.role) {
        // 완료 페이지에서 사용할 role을 sessionStorage에 저장
        if (globalThis.window !== undefined && form.role) {
          globalThis.window.sessionStorage.setItem(
            "signup-complete-role",
            form.role
          );
        }
        reset();
        router.push("/signup/complete");
      } else {
        setModalMessage("회원가입에 실패했습니다.\n다시 시도해주세요.");
        setModalOpen(true);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("회원가입 요청 실패:", error);
      }
      setModalMessage("서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
      setModalOpen(true);
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
