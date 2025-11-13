"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"

/**
 * PhoneInputProps
 * @typedef {Object} PhoneInputProps
 * @property {string} label - 입력 필드 내부에 표시될 라벨 텍스트입니다.
 * @property {string} carrier - 현재 선택된 통신사 값입니다.
 * @property {string} phoneNumber - 입력 중인 전화번호 값입니다.
 * @property {(value: string) => void} onCarrierChange - 통신사 변경 시 상위 컴포넌트로 전달되는 콜백 함수입니다.
 * @property {(value: string) => void} onPhoneNumberChange - 전화번호 변경 시 상위 컴포넌트로 전달되는 콜백 함수입니다.
 */
interface PhoneNumberInputProps {
  label: string
  carrier: string
  phoneNumber: string
  onCarrierChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
}

/**
 * PhoneInput
 *
 * 통신사 선택 + 전화번호 입력 필드를 포함한 공통 입력 컴포넌트입니다.
 * 
 * - 라벨이 입력 필드 내부 상단에 표시됨
 * - 숫자 이외 입력 시 에러 메시지 표시 (내부 고정 공간)
 * - 에러가 발생해도 외부 간격은 유지
 * - 통신사 드롭다운 클릭 시 목록 표시 및 자동 닫힘
 * - 레이아웃 변형 없는 transition-opacity 적용
 */
export function PhoneNumberInput({
  label,
  carrier,
  phoneNumber,
  onCarrierChange,
  onPhoneNumberChange,
}: PhoneNumberInputProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const carriers = ["SKT", "KT", "LG U+", "알뜰폰"]

  /** 드롭다운 열기/닫기 */
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen((prev) => !prev)
  }

  /** 통신사 선택 */
  const handleSelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onCarrierChange(value)
    setOpen(false)
  }

  /** 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /** 전화번호 입력 (숫자 이외 감지) */
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) {
      setError(true)
    } else {
      setError(false)
    }
    onPhoneNumberChange(value.replace(/[^0-9]/g, ""))

    // 다른 이벤트(입력) 발생 시 드롭다운 닫기
    if (open) setOpen(false)
  }

  /** 포커스 시 에러 해제 */
  const handleFocus = () => {
    if (error) setError(false)
    if (open) setOpen(false)
  }

  return (
    <div className="flex flex-col gap-[4px]">
      {/* 입력 박스 + 에러 메시지 포함 영역 */}
      <div className="flex flex-col w-[320px]">
        {/* 입력 영역 */}
        <div
          ref={dropdownRef}
          className="w-[320px] h-[64px] rounded-[6px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]
            pt-[11px] pb-[11px] flex flex-col justify-start transition-shadow
            bg-neutral-7 focus-within:ring-2 focus-within:ring-primary-1 relative px-[16px]"
        >
          {/* 라벨 */}
          <label className="whitespace-pre-line text-body-08 leading-[14px] tracking-[-0.6px] text-neutral-3 mb-[9px]">
            {label}
          </label>

          {/* 입력 영역: 통신사 + 전화번호 */}
          <div className="relative flex items-center h-[19px]">
            {/* 통신사 + 화살표 */}
            <div
              onClick={handleToggle}
              className="flex items-center justify-between w-[100px] select-none"
            >
              <span className="text-body-04 leading-[19px] tracking-[-0.6px] text-neutral-1 whitespace-nowrap">
                {carrier}
              </span>
              <Image
                src="/icons/arrow-down.png"
                alt="arrow-down"
                width={16}
                height={16}
                unoptimized
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                }}
                className={`${open ? "rotate-0" : "rotate-180"}`}
              />
            </div>

            {/* 전화번호 입력란 */}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onFocus={handleFocus}
              placeholder="01012341234"
              className="flex-1 ml-[12px] text-body-04 leading-[19px] tracking-[-0.6px] text-neutral-1 
                placeholder:text-neutral-3 focus:outline-none bg-transparent border-0 p-0 m-0"
            />
          </div>

          {/* 드롭다운 */}
          {open && (
            <div
              className="absolute top-[60px] left-0 w-[110px] bg-white border
              rounded-[10px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] z-10 overflow-hidden"
            >
              {carriers.map((item) => (
                <div
                  key={item}
                  onClick={(e) => handleSelect(item, e)}
                  className={`px-[14px] py-[10px] hover:bg-monochrome-gray text-body-04 whitespace-nowrap ${
                    item === carrier ? "text-primary-1" : "text-neutral-1"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 내부 고정 에러 메시지 (레이아웃 유지됨) */}
        <div className="h-[20px] mt-[4px]">
          {error && <p className="text-error text-body-03">숫자만 입력하세요.</p>}
        </div>
      </div>
    </div>
  )
}