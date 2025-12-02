"use client"

import VerificationForm from "@/components/custom/verification/VerificationForm"
import { useRegisterStore } from "@/store/registerStore"

interface Step03AuthProps {
  onNext: () => void
}

export default function Step03Auth({ onNext }: Step03AuthProps) {
  const { setField } = useRegisterStore()

  const handleSuccess = () => {
    onNext()
  }

  return (
    <div className="px-[24px]">
      <VerificationForm
        mode="verify"
        onSuccess={handleSuccess}
        setField={setField as (key: string, value: any) => void}
      />
    </div>
  )
}
