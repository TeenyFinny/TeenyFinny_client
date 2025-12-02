"use client"

import type React from "react"

/**
 * StateButtonProps
 * @typedef {Object} StateButtonProps
 * @property {boolean} enabled - 버튼의 활성화 상태를 제어합니다. `true`일 때 버튼이 활성화되어 클릭 가능합니다.
 * @property {string} label - 버튼에 표시될 텍스트입니다.
 * @property {() => void} onClick - 버튼 클릭 시 실행될 콜백 함수입니다. `enabled`가 `false`일 때는 실행되지 않습니다.
 */
interface StateButtonProps {
  enabled: boolean
  label: string
  onClick: () => void
}

/**
 * StateBadge
 *
 * 활성화/비활성화 상태를 가진 버튼 컴포넌트입니다.
 *
 * ### 특징
 * - `enabled` 상태에 따라 버튼의 색상과 클릭 가능 여부가 결정됩니다.
 * - `enabled=true`: 노란색 배경(#f7f9a7)으로 표시되며 클릭 시 `onClick` 콜백이 실행됩니다.
 * - `enabled=false`: 회색 배경(#e8ebee)으로 표시되며 클릭 이벤트가 발생하지 않습니다.
 * - `label`로 지정된 텍스트가 버튼에 표시됩니다.
 *
 * ### 시각적 구성
 * - 활성화 상태: 노란색 배경(`bg-[#f7f9a7]`), 진한 회색 텍스트(`text-[#343434]`)
 * - 비활성화 상태: 회색 배경(`bg-[#e8ebee]`), 회색 텍스트(`text-[#989898]`)
 * - 둥근 모서리(`rounded-full`)
 * - 호버 및 활성 상태 시 투명도 변화
 *
 * @component
 * @param {StateButtonProps} props - StateButton 컴포넌트 속성
 * @returns {React.ReactElement} 버튼 요소
 *
 * @example
 * ```tsx
 * // 활성화된 버튼
 * <StateButton
 *   enabled={true}
 *   label="용돈조르기"
 *   onClick={() => alert("버튼 클릭됨")}
 * />
 *
 * // 비활성화된 버튼
 * <StateButton
 *   enabled={false}
 *   label="용돈조르기"
 *   onClick={() => {}}
 * />
 * ```
 */
export function StateBadge({ enabled, label, onClick }: StateButtonProps) {
  /**
   * 버튼 클릭 이벤트 핸들러입니다.
   * `enabled`가 `true`일 때만 `onClick` 콜백을 실행합니다.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - 클릭 이벤트 객체
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enabled) {
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!enabled}
      className={`
        inline-flex items-center justify-center gap-[10px]
        w-[97px] h-[32px] px-[12px] py-[5px] rounded-[26px] transition-all whitespace-pre-line
        leading-[14px] tracking-[-0.6px] text-body-05 font-medium
        ${
          enabled
            ? "bg-primary-3 text-neutral-1 hover:opacity-90 active:opacity-80 cursor-pointer"
            : "bg-neutral-7 text-neutral-2 cursor-not-allowed"
        }
      `}
    >
      {label}
    </button>
  )
}
