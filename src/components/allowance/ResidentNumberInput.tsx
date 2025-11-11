"use client"

import React, { useState, useRef, useEffect } from "react"

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
 * - 앞 6자리(생년월일), 뒤 1자리만 입력 가능 (나머지 ●●●●●● 고정 표시)
 * - 숫자만 입력 가능, 자동 포커스 이동
 * - 앞자리 입력 완료 시 뒷자리 입력칸 초기화 후 자동 포커스 이동
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
    if (/[^0-9]/.test(value)) {
      setError(true)
    } else {
      setError(false)
    }

    const numeric = value.replace(/[^0-9]/g, "")
    if (numeric.length <= 6) {
      onFrontChange(numeric)

      // ✅ 6자리 완성 시 — 뒷자리 값 초기화 후 포커스 이동
      if (numeric.length === 6) {
        onBackChange("") // 이전 입력값 초기화
        setTimeout(() => backRef.current?.focus(), 0)
      }
    }
  }

  /** 뒷자리 첫 숫자 입력 */
  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) {
      setError(true)
    } else {
      setError(false)
    }
    const numeric = value.replace(/[^0-9]/g, "")
    if (numeric.length <= 1) {
      onBackChange(numeric)
    }
  }

  /** 포커스 시 에러 제거 */
  const handleFocus = () => setError(false)

  return (
    <div className="flex flex-col gap-[4px]">
      {/* 라벨 */}
      <label className="text-body-03 text-neutral-2">{label}</label>

      {/* 입력 박스 */}
      <div
        className="flex items-center justify-start w-[320px] h-[64px] px-[16px]
        bg-neutral-7 rounded-[6px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]
        text-body-01 text-neutral-1 focus-within:ring-2 focus-within:ring-primary-1 relative"
      >
        {/* 앞자리 입력 */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={front}
          onChange={handleFrontChange}
          onFocus={handleFocus}
          placeholder="010101"
          className="w-[90px] text-neutral-1 placeholder:text-neutral-2 text-body-04
            focus:outline-none bg-transparent"
        />

        {/* 구분선 */}
        <span className="mx-[21px] text-neutral-1 text-body-4">-</span>

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
            className="w-[16px] text-neutral-1 placeholder:text-neutral-2 text-body-04
              focus:outline-none bg-transparent"
          />
          <span className="ml-[2px] text-neutral-1 tracking-[2px] select-none">
            ●●●●●●
          </span>
        </div>
      </div>

      {/* 🚨 내부 고정 에러 메시지 (레이아웃 유지됨) */}
      <div className="h-[20px] mt-[4px]">
        {error && <p className="text-error text-body-03">숫자만 입력하세요.</p>}
      </div>
    </div>
  )
}
