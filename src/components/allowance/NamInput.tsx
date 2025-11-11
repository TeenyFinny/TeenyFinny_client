"use client"

import type React from "react"
import { useState } from "react"
import { NormalInput } from "../ui/input/NormalInput"

/**
 * NameInputProps
 * @typedef {Object} NameInputProps
 * @property {string} label - 입력 필드 위에 표시될 레이블 텍스트입니다.
 * @property {string} placeholder - 입력 필드에 표시될 플레이스홀더 텍스트입니다.
 * @property {string} value - 입력 필드의 현재 값입니다.
 * @property {(value: string) => void} onChange - 입력 값이 변경될 때 실행될 콜백 함수입니다.
 */
interface NameInputProps {
  value: string
  onChange: (value: string) => void
}

/**
 * NameInput
 *
 * 이름 입력 전용 텍스트 필드 컴포넌트입니다.
 * 
 * ### 특징
 * - 한글만 입력 가능 (영문, 숫자, 특수문자 자동 제거)
 * - 잘못된 문자를 입력하면 에러 메시지 표시
 * - 포커스 또는 올바른 입력 시 에러 메시지 자동 해제
 * - 스타일과 레이아웃은 기존 `NormalInput`과 100% 동일
 */
export function NameInput({ value, onChange }: NameInputProps) {
  const [error, setError] = useState(false)

  /** 입력 이벤트 핸들러 (한글만 허용) */
  const handleChange = (inputValue: string) => {
    if (/[^가-힣ㄱ-ㅎㅏ-ㅣ]/.test(inputValue)) {
      setError(true)
    } else {
      setError(false)
    }

    const filteredValue = inputValue.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, "")
    onChange(filteredValue)
  }

  /** 포커스 시 에러 해제 */
  const handleFocus = () => setError(false)

  return (
    <div className="flex flex-col gap-[4px]">
      {/* 입력 박스 */}
      <div className="">
        <NormalInput
          label="이름"
          value={value}
          placeholder="홍길동"
          onChange={handleChange}
        />

        {/* 🚨 에러 메시지 (내부 고정, 높이 유지) */}
        <div className="h-[20px] mt-[4px]">
          {error && (
            <p className="text-error text-body-03">한글만 입력할 수 있습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
