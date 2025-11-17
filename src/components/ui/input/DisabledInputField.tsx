"use client"

/**
 * DisabledInputFieldProps
 * @typedef {Object} DisabledInputFieldProps
 * @property {string} label - 입력 필드 상단에 표시될 라벨 텍스트입니다.
 * @property {string} content - 비활성화된 입력 필드에 표시될 내용입니다.
 * @property {(value: string) => void} unit - _ 원 처럼 입력 옆에 장식으로 붙을 문자열입니다.
 * @property {(value: boolean) => void} isRight - true 설정 시 문자열이 오른쪽 정렬됩니다.
 */
interface DisabledInputFieldProps {
  label: string
  content: string
  unit?: string;
  isRight?: boolean;
}

/**
 * DisabledInputField
 *
 * 정보 확인용으로 사용되는 비활성화된 입력 필드 컴포넌트입니다.
 * 사용자가 텍스트를 입력할 수 없으며, 오직 정보를 표시하는 용도로만 사용됩니다.
 *
 * ### 특징
 * - 입력이 완전히 비활성화되어 있습니다 (`disabled` 속성).
 * - `label`과 `content`를 props로 받아 표시합니다.
 * - `whitespace-pre-line`을 사용하여 줄바꿈을 유연하게 처리합니다.
 *
 * ### 시각적 구성
 * - 상단에 라벨 텍스트 (`text-[#343434]`)
 * - 하단에 비활성화된 입력 필드 (`bg-[#e8ebee]`)
 * - 입력 필드는 읽기 전용이며 포커스 불가능
 *
 * @component
 * @param {DisabledInputFieldProps} props - DisabledInputField 컴포넌트 속성
 * @returns {React.ReactElement} 비활성화된 입력 필드 요소
 */
export function DisabledInputField({ label, content, isRight, unit }: DisabledInputFieldProps) {
  // isRight에 따라 텍스트 정렬만 변경 (addon은 항상 오른쪽)
  const inputAlignClasses = isRight
    ? "pl-[16px] pr-[28px] text-right"
    : "pl-[16px] pr-[28px] text-left"

  // addon은 항상 오른쪽 끝
  const addonPositionClass = "right-[12px]"

  return (
    <div className="w-[320px]">
      {/** label: 높이 19px, 인풋과 간격 0px */}
      <label className="text-body-03 text-neutral-2">
        {label}
      </label>

      <div className="relative w-[320px] h-[64px]">
        <input
          type="text"
          value={content}
          disabled = {true}
          className={
            `w-full h-full rounded-[6px] 
             bg-neutral-5 border-neutral-3 border-1 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]
             text-body-04 leading-[19px] tracking-[-0.6px] text-neutral-1
             placeholder:text-neutral-3 
             focus:outline-none focus-within:ring-2 focus-within:ring-primary-1
             ${inputAlignClasses}`
          }
        />

        {unit && (
          <span
            className={
              `pointer-events-none absolute ${addonPositionClass} top-1/2 
               -translate-y-1/2 text-body-04 text-neutral-3`
            }
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
