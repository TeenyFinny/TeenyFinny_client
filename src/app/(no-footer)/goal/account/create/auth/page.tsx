"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput"
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput"
import NameInput from "@/components/custom/allowance/checking/NameInput"

export default function GoalAccountCreateAuthPage() {
  const router = useRouter()
  const [carrier, setCarrier] = useState("SKT")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthFront, setBirthFront] = useState("")
  const [birthBack, setBirthBack] = useState("")
  const [name, setName] = useState("")

  const isButtonEnabled =
    phoneNumber.length === 11 &&
    birthFront.length === 6 &&
    birthBack.length === 1 &&
    name.length > 0

  const handleNext = () => {
    router.push("/goal/account/create/terms")
  }

  return (
    <div className="flex flex-col px-[24px]">
      <div className="mt-[43px] mb-[24px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"이용중인 통신사 정보와\n휴대폰 번호를 입력해 주세요"}
        </h1>
      </div>

      <PhoneNumberInput
        label="휴대폰 번호"
        carrier={carrier}
        phoneNumber={phoneNumber}
        onCarrierChange={setCarrier}
        onPhoneNumberChange={setPhoneNumber}
      />

      <ResidentNumberInput
        label="주민등록번호"
        front={birthFront}
        back={birthBack}
        onFrontChange={setBirthFront}
        onBackChange={setBirthBack}
      />

      <NameInput value={name} onChange={setName} />

      <div className="absolute bottom-14 flex flex-col gap-5 items-center mt-[150px]">
        {isButtonEnabled ? (
          <BigButtonActivated label="다음" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>
    </div>
  )
}
