"use client";

import VerificationForm from "@/components/custom/verification/VerificationForm";
import { useRegisterStore } from "@/store/registerStore";

type Step03VerificationProps = Readonly<{ onNext: () => void }>;

/**
 * Step03Verification
 *
 * 회원가입 단계 3: 본인인증
 * VerificationForm 컴포넌트를 signup 모드로 사용
 */
export default function Step03Verification({
  onNext,
}: Step03VerificationProps) {
  const { form, setField } = useRegisterStore();

  return (
    <VerificationForm
      mode="signup"
      onNext={onNext}
      form={form}
      setField={setField as (key: string, value: any) => void}
    />
  );
}
