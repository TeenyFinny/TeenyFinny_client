"use client"

import React, { useState, useRef } from "react"

/**
 * ResidentNumberInputProps
 * @typedef {Object} ResidentNumberInputProps
 * @property {string} label - 입력 필드 내부에 표시될 라벨 텍스트입니다.
 * @property {string} front - 주민번호 앞 6자리 값입니다.
 * @property {string} back - 주민번호 뒤 첫 1자리 값입니다.
 * @property {(value: string) => void} onFrontChange - 앞자리 변경 콜백입니다.
 * @property {(value: string) => void} onBackChange - 뒷자리 변경 콜백입니다.
 */
interface ResidentNumberInputProps {
  label: string
  front: string
  back: string
  onFrontChange: (value: string) => void
  onBackChange: (value: string) => void
}

/**
 * ResidentNumberInput
 *
 * 주민등록번호 입력 컴포넌트
 * - 입력 필드 내부에 라벨이 표시됨
 * - 앞 6자리, 뒤 1자리 입력 가능 (나머지 ●●●●●● 고정)
 * - 숫자만 허용, 자동 포커스 이동
 * - 에러 메시지 고정 영역 포함
 */
export function ResidentNumberInput({
  label,
  front,
  back,
  onFrontChange,
  onBackChange,
}: ResidentNumberInputProps) {
  const [error, setError] = useState(false)
  const backRef = useRef<HTMLInputElement>(null)

  /** 앞자리 입력 처리 */
  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) setError(true)
    else setError(false)

    const numeric = value.replace(/[^0-9]/g, "")
    if (numeric.length <= 6) {
      onFrontChange(numeric)
      // 6자리 완성 시 → 뒷자리 초기화 + 포커스 이동
      if (numeric.length === 6) {
        onBackChange("")
        setTimeout(() => backRef.current?.focus(), 0)
      }
    }
  }

  /** 뒷자리 입력 처리 */
  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) setError(true)
    else setError(false)

    const numeric = value.replace(/[^0-9]/g, "")
    if (numeric.length <= 1) onBackChange(numeric)
  }

  /** 포커스 시 에러 제거 */
  const handleFocus = () => setError(false)

  return (
    <div className="flex flex-col gap-[4px]">
      {/* 입력 영역 */}
      <div
        className="w-[320px] h-[64px] rounded-[6px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]
          pt-[11px] pb-[11px] flex flex-col justify-start transition-shadow
          bg-neutral-7 focus-within:ring-2 focus-within:ring-primary-1 relative px-[16px]"
      >
        {/* 내부 라벨 */}
        <label className="whitespace-pre-line text-body-08 leading-[14px] tracking-[-0.6px] text-neutral-3 mb-[9px]">
          {label}
        </label>

        {/* 주민번호 입력 */}
        <div className="flex items-center">
          {/* 앞자리 입력 */}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={front}
            onChange={handleFrontChange}
            onFocus={handleFocus}
            placeholder="앞 6자리"
            className="w-[90px] text-body-04 text-neutral-1 placeholder:text-neutral-3
              bg-transparent border-0 outline-none"
          />

          {/* 구분선 */}
          <span className="mx-[21px] text-neutral-1 text-body-04">-</span>

          {/* 뒷자리 입력 */}
          <div className="flex items-center w-full">
            <input
              ref={backRef}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={back}
              onChange={handleBackChange}
              onFocus={handleFocus}
              placeholder="_"
              className="w-[16px] text-neutral-1 placeholder:text-neutral-3 text-body-04
                bg-transparent border-0 outline-none"
            />
            <span className="text-neutral-1 tracking-[2px] select-none">
              ●●●●●●
            </span>
          </div>
        </div>
      </div>

      {/* 에러 메시지 (고정 높이 유지) */}
      <div className="h-[20px] mt-[4px]">
        {error && <p className="text-error text-body-03">숫자만 입력하세요.</p>}
      </div>
    </div>
  )
}
