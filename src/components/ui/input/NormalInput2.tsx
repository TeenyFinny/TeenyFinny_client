"use client"

import type React from "react"

/**
 * LabeledInputProps
 * @typedef {Object} LabeledInputProps
 * @property {string} label - 입력 필드 위에 표시되는 레이블 텍스트입니다.
 * @property {string} value - 입력 필드의 현재 값입니다.
 * @property {string} [placeholder] - 입력 필드가 비어있을 때 표시되는 플레이스홀더 텍스트입니다.
 * @property {(value: string) => void} onChange - 입력 값이 변경될 때 실행되는 콜백 함수입니다.
 */
interface LabeledInputProps {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

/**
 * NormalInput2
 *
 * 레이블과 함께 제공되는 재사용 가능한 입력 필드 컴포넌트입니다.
 *
 * ### 특징
 * - 레이블과 입력 필드가 수직으로 배치됩니다.
 * - `onChange` 콜백을 통해 상위 컴포넌트에서 입력 값을 관리할 수 있습니다.
 * - `placeholder`를 통해 입력 안내 텍스트를 표시할 수 있습니다.
 * - `whitespace-pre-line`을 사용하여 레이블 텍스트의 줄바꿈을 지원합니다.
 *
 * ### 시각적 구성
 * - 레이블: 회색 텍스트(`text-[#989898]`)로 상단에 표시
 * - 입력 필드: 흰색 배경(`bg-[#ffffff]`)에 검은색 텍스트(`text-[#343434]`)
 * - 테두리: 회색 테두리(`border-[#e0e0e0]`)
 * - 포커스 시: 파란색 링(`focus:ring-[#0067ac]`)
 *
 * @component
 * @param {LabeledInputProps} props - LabeledInput 컴포넌트 속성
 * @returns {React.ReactElement} 레이블이 있는 입력 필드 요소
 *
 * @example
 * ```tsx
 * const [text, setText] = useState("")
 *
 * <LabeledInput
 *   label="이름"
 *   value={text}
 *   placeholder="이름을 입력하세요"
 *   onChange={setText}
 * />
 * ```
 */
export function NormalInput2({ label, value, placeholder, onChange }: LabeledInputProps) {
  /**
   * 입력 필드의 값이 변경될 때 호출되는 이벤트 핸들러입니다.
   * 입력된 값을 상위 컴포넌트로 전달합니다.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 변경 이벤트 객체
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    // 시안 컨테이너: 320×64, 좌 37px / 상 184px 오프셋
    <div
      className={[
        "w-[320px] h-[64px]",
        "bg-neutral-7 rounded-[6px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]",
        "pl-[16px] pt-[11px] pb-[11px] flex flex-col justify-start",
        "transition-shadow focus-within:ring-2 focus-within:ring-[#0067ac]"
      ].join(" ")}
    >
      {/** label — 12/14, tracking -0.6, #989898 */}
      <label className="whitespace-pre-line text-body-08 leading-[14px] tracking-[-0.6px] text-neutral-3 mb-[9px]">
        {label}
      </label>

      {/** input value — 16/19, tracking -0.6, #343434 (placeholder #989898) */}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full h-[19px] bg-transparent border-0 p-0 m-0 text-body-01 leading-[19px] tracking-[-0.6px] 
            text-neutral-1 placeholder:text-neutral-3 focus:outline-none"
      />
    </div>
  )
}
