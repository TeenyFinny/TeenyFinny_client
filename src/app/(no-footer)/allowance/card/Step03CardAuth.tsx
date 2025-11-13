"use client"

import { useState } from "react"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput"
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput"
import NameInput from "@/components/custom/allowance/checking/NameInput"
/**
 * Step03CardAuth
 *
 * 카드 발급 절차 중 본인인증 정보를 입력받는 페이지 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 이용 중인 통신사, 휴대폰 번호, 주민등록번호, 이름을 입력받습니다.
 * - 모든 입력이 올바르게 완료되어야 다음 단계로 이동할 수 있습니다.
 * - 입력 검증 로직:
 *   - 휴대폰 번호: 11자리 숫자만 허용
 *   - 주민등록번호: 앞 6자리 + 뒤 1자리 숫자만 허용
 *   - 이름: 한글만 허용 (NameInput 내부에서 처리)
 * - 입력이 모두 유효할 때만 "다음" 버튼이 활성화됩니다.
 *
 * ### 시각적 구성
 * - 상단: 타이틀 ("이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요")
 * - 중간: 통신사 선택 + 휴대폰 번호 입력, 주민등록번호 입력, 이름 입력 필드
 * - 하단: 다음 버튼 (활성화/비활성 상태에 따라 다른 컴포넌트 렌더링)
 *
 * @component
 * @param {Step03CardAuthProps} props - `onNext` 콜백을 전달받아 다음 단계로 이동할 수 있습니다.
 * @returns {React.ReactElement} 카드 본인인증 입력 페이지 UI
 *
 * @example
 * ```tsx
 * <Step03CardAuth onNext={() => setStep(4)} />
 * ```
 */
interface Step03CardAuthProps {
  onNext: () => void
}

export default function Step03CardAuth({ onNext }: Step03CardAuthProps) {
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
