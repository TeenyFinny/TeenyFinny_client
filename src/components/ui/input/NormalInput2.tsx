"use client"

import type React from "react"

interface LabeledInputProps {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
  isNumeric?: boolean // ✅ 숫자 전용 여부 (금액/일자용)
  unit?: string // ✅ 단위 표시 (ex: 원, 일)
}

export function NormalInput2({
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
  isNumeric = false,
  unit,
}: LabeledInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) onChange(e.target.value)
  }

  return (
    <div
      className={[
        "w-[320px] h-[64px]",
        "rounded-[6px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]",
        "pt-[11px] pb-[11px] flex flex-col justify-start transition-shadow",
        disabled
          ? "bg-monochrome-lightgray cursor-not-allowed"
          : "bg-neutral-7 focus-within:ring-2 focus-within:ring-[#0067ac]",
      ].join(" ")}
    >
      {/* label */}
      <label className="whitespace-pre-line text-body-08 leading-[14px] tracking-[-0.6px] text-neutral-3 mb-[9px] pl-[16px]">
        {label}
      </label>

      {/* input + unit */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          readOnly={disabled}
          disabled={disabled}
          className={[
            "w-full h-[19px] bg-transparent border-0 p-0 m-0 text-body-04 leading-[19px] tracking-[-0.6px]",
            disabled
              ? "text-neutral-3 placeholder:text-neutral-4"
              : "text-neutral-1 placeholder:text-neutral-3 focus:outline-none",
            isNumeric
              ? "text-right pr-[28px] placeholder:text-right" // ✅ 숫자 입력은 오른쪽 정렬
              : "text-left pl-[16px]", // ✅ 일반 텍스트는 왼쪽 정렬
          ].join(" ")}
        />
        {unit && (
          <span
            className={`absolute right-[12px] text-body-02 text-neutral-3 select-none pointer-events-none`}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
