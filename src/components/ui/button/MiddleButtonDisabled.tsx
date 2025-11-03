"use client"

/**
 * CustomButtonProps
 * @typedef {Object} CustomButtonProps
 * @property {string} label - 버튼에 표시될 텍스트입니다.
 * @property {() => void} onClick - 버튼 클릭 시 실행될 콜백 함수입니다.
 */
interface CustomButtonProps {
  label: string
  onClick: () => void
}

/**
 * CustomButton
 *
 * 재사용 가능한 파란색 버튼 컴포넌트입니다.
 *
 * ### 특징
 * - `label` prop으로 버튼 텍스트를 지정할 수 있습니다.
 * - `onClick` prop으로 클릭 이벤트 핸들러를 전달받습니다.
 * - `whitespace-pre-line`을 사용하여 개발자가 원하는 대로 줄바꿈할 수 있습니다.
 *
 * ### 시각적 구성
 * - 파란색 배경(`bg-[#0067ac]`)
 * - 흰색 텍스트(`text-[#ffffff]`)
 * - 둥근 모서리(`rounded-[20px]`)
 * - 전체 너비(`w-full`)
 * - 호버 및 액티브 상태 효과
 *
 * @component
 * @param {CustomButtonProps} props - CustomButton 컴포넌트 속성
 * @returns {React.ReactElement} 버튼 요소
 *
 * @example
 * ```tsx
 * <CustomButton
 *   label="버튼"
 *   onClick={() => alert("버튼 클릭됨!")}
 * />
 * ```
 */
export function MiddleButtonDisabled({ label, onClick }: CustomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        relative flex items-center justify-center
        w-[200px] h-[56px] p-0
        rounded-[15px] bg-neutral-6
        text-neutral-2 text-body-06 leading-[19px] font-semibold tracking-[-0.6px]
        whitespace-pre-line
      "
      disabled={true}
    >
      {label}
    </button>
  )
}
