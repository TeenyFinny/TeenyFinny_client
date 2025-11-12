"use client"

/**
 * DisabledInputFieldProps
 * @typedef {Object} DisabledInputFieldProps
 * @property {string} label - 입력 필드 상단에 표시될 라벨 텍스트입니다.
 * @property {string} content - 비활성화된 입력 필드에 표시될 내용입니다.
 */
interface DisabledInputFieldProps {
  label: string
  content: string
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
export function DisabledInputField({ label, content }: DisabledInputFieldProps) {
  return (
    <div className="w-[320px]">
      {/** label: 높이 19px, 인풋과 간격 0px */}
      <label className="block h-[19px] leading-[19px] text-body-07 text-neutral-1 whitespace-pre-line mb-0">
        {label}
      </label>

      {/** disabled input field: 320x64, 라운드 6px */}
      <div className="w-full h-16 rounded-[6px] bg-monochrome-lightgray px-4 flex items-center text-body-06 text-neutral-3 whitespace-pre-line cursor-not-allowed">
        {content}
      </div>
    </div>
  )
}
