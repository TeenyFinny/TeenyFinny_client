"use client";

import VerificationForm from "@/components/custom/verification/VerificationForm";
import { useRegisterStore } from "@/store/registerStore";

type Step04AuthProps = Readonly<{ onNext: () => void }>;

/**
 * Step04Auth
 *
 * 계좌 개설 단계 4: 본인인증
 * VerificationForm 컴포넌트를 verify 모드로 사용
 */
export default function Step04Auth({ onNext }: Step04AuthProps) {
  const { form, setField } = useRegisterStore();

  const handleSuccess = () => {
    onNext();
  };

  return (
    <div className="px-[27px]">
      <VerificationForm
        mode="verify"
        onSuccess={handleSuccess}
        setField={setField as (key: string, value: any) => void}
      />
    </div>
  );
}
