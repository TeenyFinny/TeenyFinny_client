"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

/**
 * PasswordInputProps
 * @typedef {Object} PasswordInputProps
 * @property {string} value - 비밀번호의 현재 값(Controlled value).
 * @property {(value: string) => void} onChange - 값이 변경될 때 상위 상태를 갱신하는 콜백.
 * @property {string} [placeholder] - 입력 필드의 placeholder 텍스트.
 * @property {string} [label="Password"] - 입력 상단에 표시되는 레이블 텍스트.
 */
interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

/**
 * PasswordInput
 *
 * 비밀번호 입력 전용 컴포넌트로, **표시/숨김 토글 아이콘**을 제공합니다.
 * - 완전 제어(Controlled) 입력: `value`와 `onChange`를 통해 외부에서 상태를 관리합니다.
 * - 토글 버튼으로 입력 타입을 `password` ↔ `text` 전환할 수 있습니다.
 *
 * @component
 * @param {PasswordInputProps} props - 컴포넌트 속성
 * @returns {React.ReactElement} 비밀번호 입력 필드
 *
 * @example
 * // 기본 사용
 * const [pw, setPw] = useState("");
 * <PasswordInput
 *   value={pw}
 *   onChange={setPw}
 *   label="비밀번호"
 *   placeholder="비밀번호를 입력하세요"
 * />
 *
 * @example
 * // 폼과 함께
 * <form onSubmit={handleSubmit}>
 *   <PasswordInput value={pw} onChange={setPw} />
 *   <button type="submit">로그인</button>
 * </form>
 *
 * @remarks
 * - 접근성: 토글 버튼은 `aria-label`을 통해 현재 상태에 맞는 대체 텍스트를 제공합니다.
 * - 시각적 스타일은 Tailwind 유틸리티 클래스로 구성되어 있으며, 부모 컨테이너의 레이아웃에 따라 가로폭이 달라질 수 있습니다.
 */
export function PasswordInput({
  value,
  onChange,
  placeholder = "",
  label = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  /**
   * 비밀번호 표시/숨김 상태를 전환합니다.
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  /**
   * 입력 값 변경 시 상위로 값을 전달합니다.
   * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 이벤트
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div
      className="w-[320px] h-[64px] rounded-[6px] bg-neutral-7 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] 
        px-[16px] py-[11px] flex flex-col justify-between"
    >
      {/* label */}
      <label className="text-body-08 leading-[14px] tracking-[-0.6px] text-neutral-3">
        {label}
      </label>

      {/* input + icon row */}
      <div className="flex items-center justify-between">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-neutral-1 text-body-01
            leading-[19px] tracking-[-0.6px] placeholder:text-neutral-3"
          aria-label={label}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="ml-[8px] flex items-center justify-center h-6 w-6 text-neutral-2 focus:outline-none"
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
        >
          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
      </div>
    </div>
  )
}
