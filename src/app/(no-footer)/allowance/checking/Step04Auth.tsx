"use client"

import { useState } from "react"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { PhoneNumberInput } from "@/components/custom/allowance/PhoneNumberInput"
import { ResidentNumberInput } from "@/components/custom/allowance/ResidentNumberInput"
import NameInput from "@/components/custom/allowance/NameInput"

interface Step04AuthProps {
  onNext: () => void
}

export default function Step04Auth({ onNext }: Step04AuthProps) {
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

  return (
    <div className="flex flex-col h-full px-[24px]">
      {/* 타이틀 */}
      <div className="mt-[43px] mb-[24px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요"}
        </h1>
      </div>

      {/* 통신사 + 번호 */}
      <PhoneNumberInput
        label="휴대폰 번호"
        carrier={carrier}
        phoneNumber={phoneNumber}
        onCarrierChange={setCarrier}
        onPhoneNumberChange={setPhoneNumber}
      />

      {/* 주민등록번호 */}
      <ResidentNumberInput
        label="주민등록번호"
        front={birthFront}
        back={birthBack}
        onFrontChange={setBirthFront}
        onBackChange={setBirthBack}
      />

      {/* 이름 */}
      <NameInput value={name} onChange={setName} />

      {/* 버튼 */}
      <div className="flex flex-col gap-5 items-center mb-[56px] mt-[207px]">
        {isButtonEnabled ? (
          <BigButtonActivated label="다음" onClick={onNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>
    </div>
  )
}
