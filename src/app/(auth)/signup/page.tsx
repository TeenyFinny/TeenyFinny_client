"use client";

import { useRegisterStore } from "@/store/registerStore";
import { useRegisterStep } from "./useRgisterStep";
import Step1Terms from "./Step01Terms";

/**
 * RegisterPage
 *
 * 회원가입 플로우의 1단계(약관 동의)를 렌더링하는 페이지입니다.
 * Zustand로 상태를 관리하며, 단계 전환은 RegisterStepProvider Context를 사용합니다.
 */
export default function RegisterPage() {
  /** 단계 제어 (Context) */
  const { step, next } = useRegisterStep();

  /** 전역 회원가입 상태 (Zustand) */
  const { form, setField } = useRegisterStore();

  // 현재 단계(1단계) 외에는 일시적으로 렌더링하지 않음
  if (step !== 1) return null;

  return (
    <main className="px-6 flex flex-col items-center">
      <div className="w-full max-w-[327px]">
        {/* Step1Terms에 props 전달 */}
        <Step1Terms
          terms={form.terms} // 현재 약관 동의 상태
          onChange={(updatedTerms) => setField("terms", updatedTerms)} // 약관 상태 갱신 함수
          onNext={next} // 다음 단계로 이동 함수
        />
      </div>
    </main>
  );
}
