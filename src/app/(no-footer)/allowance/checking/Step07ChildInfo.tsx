"use client"

import { useState } from "react"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"

/**
 * Step08ChildInfoInputProps
 * @typedef {Object} Step07ChildInfoInputProps
 * @property {() => void} onNext - 모든 입력 완료 시 실행되는 콜백 함수입니다.
 */

/**
 * Step08ChildInfoInput
 *
 * 자녀 정보를 입력받는 페이지 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 이름, 휴대폰 번호, 생년월일, 집주소, 상세주소를 입력받습니다.
 * - 이름은 한글만 허용됩니다.
 * - 휴대폰 번호는 숫자만 허용하며, 최대 11자리까지만 입력할 수 있습니다.
 * - 생년월일은 숫자만 허용하며, 6자리(YYMMDD)로 입력해야 합니다.
 * - 모든 입력이 올바르게 완료되면 하단의 "모두 입력했어요" 버튼이 활성화됩니다.
 * - 각 입력 필드 아래에는 고정 높이(20px)의 에러 메시지 영역이 존재합니다.
 *
 * ### 화면 구성
 * - 제목: "자녀 정보를 입력해 주세요"
 * - 입력 필드 5개: 이름 / 휴대폰 번호 / 생년월일 / 집주소 / 상세주소
 * - 하단 버튼: "모두 입력했어요" (활성/비활성 상태 구분)
 *
 * @component
 * @param {Step07ChildInfoInputProps} props - 컴포넌트 속성
 * @returns {React.ReactElement}
 */
export default function Step07ChildInfoInput({ onNext }: { onNext: () => void }) {
  const [childName, setChildName] = useState("")
  const [childPhone, setChildPhone] = useState("")
  const [birth, setBirth] = useState("")
  const [address, setAddress] = useState("")
  const [detailAddress, setDetailAddress] = useState("")

  const [nameError, setNameError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [birthError, setBirthError] = useState("")

/* 한글 이름 입력 시 한글만 허용 */
const handleNameChange = (value: string) => {
  // 한글만 허용 (완성형 한글 + 자음/모음 조합 중)
  const koreanRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/
  
  if (koreanRegex.test(value)) {
    setChildName(value)
    setNameError("")
  } else {
    setNameError("이름은 한글만 입력할 수 있습니다.")
  }
}

  /* 생년월일 입력 시 숫자만 허용하고 6자리(YYMMDD)까지만 입력 가능 */
  const handleBirthChange = (value: string) => {
    const numericOnly = value.replace(/[^0-9]/g, "")
    const limitedValue = numericOnly.slice(0, 6)
    setBirth(limitedValue)

    if (value !== numericOnly) {
      setBirthError("생년월일은 6자리로 입력해주세요")
    } else if (limitedValue.length > 0 && limitedValue.length !== 6) {
      setBirthError("생년월일은 6자리여야 합니다.")
    } else {
      setBirthError("")
    }
  }

  /* 휴대폰 번호 입력 시 숫자만 허용하고 11자리까지만 입력 가능 */
  const handlePhoneChange = (value: string) => {
    const numericOnly = value.replace(/[^0-9]/g, "")
    const limitedValue = numericOnly.slice(0, 11)
    setChildPhone(limitedValue)

    if (value !== numericOnly) {
      setPhoneError("휴대폰 번호는 숫자만 입력할 수 있습니다.")
    } else if (limitedValue.length > 0 && limitedValue.length !== 11) {
      setPhoneError("휴대폰 번호는 11자리여야 합니다.")
    } else {
      setPhoneError("")
    }
  }

  /* 모든 입력 필드가 유효한지 검사 */
  const allChecked =
    childName !== "" &&
    childPhone !== "" &&
    address !== "" &&
    birth !== "" &&
    detailAddress !== "" &&
    nameError === "" &&
    phoneError === "" &&
    birthError === ""

  return (
    <div className="flex flex-col px-[24px] h-full mb-[0px]">
      {/* 제목 영역 */}
      <div className="mt-[43px] mb-[26px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"자녀 정보를 입력해 주세요"}
        </h1>
      </div>

      {/* 입력 필드 영역 */}
      <div className="flex flex-col">
        {/* 이름 */}
        <div>
          <NormalInput2
            label="이름"
            placeholder="홍길동"
            value={childName}
            onChange={handleNameChange}
          />
          <div className="h-[20px] mt-[4px]">
            {nameError && <p className="text-error text-body-08">{nameError}</p>}
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <NormalInput2
            label="휴대폰 번호"
            placeholder="01012345678"
            value={childPhone}
            onChange={handlePhoneChange}
          />
          <div className="h-[20px] mt-[4px]">
            {phoneError && <p className="text-error text-body-08">{phoneError}</p>}
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <NormalInput2
            label="생년월일"
            placeholder="010101"
            value={birth}
            onChange={handleBirthChange}
          />
          <div className="h-[20px] mt-[4px]">
            {birthError && <p className="text-error text-body-08">{birthError}</p>}
          </div>
        </div>

        {/* 집주소 */}
        <div>
          <NormalInput2
            label="집주소"
            placeholder="서울시 영등포구 가마산로 20길"
            value={address}
            onChange={setAddress}
          />
          <div className="h-[20px] mt-[4px]" />
        </div>

        {/* 상세주소 */}
        <div>
          <NormalInput2
            label="상세주소"
            placeholder="1701호"
            value={detailAddress}
            onChange={setDetailAddress}
          />
          <div className="h-[20px] mt-[4px]" />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-[62px] mb-[56px]">
        {allChecked ? (
          <BigButtonActivated label="모두 입력했어요" onClick={onNext} />
        ) : (
          <BigButtonDisabled label="모두 입력했어요" onClick={() => {}} />
        )}
      </div>
    </div>
  )
}
