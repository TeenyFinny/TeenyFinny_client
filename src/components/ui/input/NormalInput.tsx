"use client"

import type React from "react"

/**
 * TextInputProps
 * @typedef {Object} TextInputProps
 * @property {string} label - 입력 필드 위에 표시될 레이블 텍스트입니다.
 * @property {string} placeholder - 입력 필드에 표시될 플레이스홀더 텍스트입니다.
 * @property {string} value - 입력 필드의 현재 값입니다.
 * @property {(value: string) => void} onChange - 입력 값이 변경될 때 실행될 콜백 함수입니다.
 */
interface TextInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

/**
 * NormalInput
 *
 * 사용자가 텍스트를 입력할 수 있는 입력 필드 컴포넌트입니다.
 *
 * ### 특징
 * - `label`을 통해 입력 필드의 제목을 표시합니다.
 * - `placeholder`를 통해 안내 텍스트를 표시합니다.
 * - `value`와 `onChange`를 통해 상위 컴포넌트에서 상태를 관리합니다.
 * - 포커스 시 테두리 색상이 변경됩니다.
 *
 * ### 시각적 구성
 * - 레이블은 진한 회색(`text-[#343434]`)
 * - 흰색 배경(`bg-[#ffffff]`)
 * - 회색 테두리(`border-[#e0e0e0]`)
 * - 포커스 시 파란색 테두리(`focus:border-[#0067ac]`)
 * - 플레이스홀더는 회색(`text-[#989898]`)
 *
 * @component
 * @param {TextInputProps} props - TextInput 컴포넌트 속성
 * @returns {React.ReactElement} 텍스트 입력 필드 요소
 *
 * @example
 * ```tsx
 * const [text, setText] = useState("")
 *
 * <TextInput
 *   label="텍스트를 입력하세요"
 *   placeholder="플레이스 홀더입니다."
 *   value={text}
 *   onChange={setText}
 * />
 * ```
 */
export function NormalInput({ label, placeholder, value, onChange }: TextInputProps) {
  /**
   * 입력 필드의 값이 변경될 때 실행되는 이벤트 핸들러입니다.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - 변경 이벤트 객체
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div>
      <label className="text-body-03 text-neutral-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="left-0 right-0 top-0 bottom-0 w-[320px] h-[64px] rounded-[6px] 
            bg-neutral-7 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] px-[16px] 
            text-body-01 leading-[19px] tracking-[-0.6px] text-neutral-1 
            placeholder:text-neutral-3 focus:outline-none focus-within:ring-2 focus-within:ring-primary-1"
      />
    </div>
  )
}
