"use client";

import { useRegisterStore } from "@/store/registerStore";
import { useRegisterStep } from "./useRgisterStep";
import Step01Terms from "./Step01Terms";
import Step02Roles from "./Step02Roles";
import Step03Verification from "./Step03Verification";
import Step04UserInfo from "./Step04UserInfo";
import Step05PasswordInstruction from "./Step05PasswordInstruction";
/**
 * RegisterPage
 *
 * 회원가입 플로우의 단계별 화면을 렌더링하는 페이지입니다.
 * Zustand로 상태를 관리하며, 단계 전환은 RegisterStepProvider Context를 사용합니다.
 *
 * Step 1: 약관 동의
 * Step 2: 역할 선택 (부모 / 자녀)
 */
export default function RegisterPage() {
  /** 단계 제어 (Context) */
  const { step, next } = useRegisterStep();

  /** 전역 회원가입 상태 (Zustand) */
  const { form, setField } = useRegisterStore();

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
        {step === 4 && <Step04UserInfo onNext={next} />}
        {/* Step 5: 간편 비밀번호 안내 */}
        {step === 5 && <Step05PasswordInstruction onNext={next} />}
      </div>
    </main>
  );
}
