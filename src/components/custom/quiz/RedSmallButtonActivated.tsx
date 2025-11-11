"use client";

/**
 * RedSmallButtonActivatedProps
 * @typedef {Object} RedSmallButtonActivatedProps
 * @property {string} label - 버튼에 표시될 텍스트
 * @property {() => void} onClick - 버튼 클릭 시 실행될 콜백 함수
 */
interface RedSmallButtonActivatedProps {
  label: string;
  onClick: () => void;
}

/**
 * RedSmallButtonActivated
 *
 * 재사용 가능한 빨간색 버튼 컴포넌트입니다.
 *
 * ### 특징
 * - `label` prop으로 버튼 텍스트를 지정할 수 있습니다.
 * - `onClick` prop으로 클릭 이벤트 핸들러를 전달받습니다.
 * - `whitespace-pre-line` 적용으로 줄바꿈 가능
 *
 * ### 시각적 구성
 * - 빨간색 배경 (`bg-error`)
 * - 흰색 텍스트 (`text-monochrome-lightgray`)
 * - 둥근 모서리 (`rounded-[15px]`)
 * - 고정 크기 (`w-[159px] h-[56px]`)
 * - 그림자 효과 (`shadow-[0_8px_16px_-6px_rgba(0,82,103,0.32)]`)
 *
 * @param {RedSmallButtonActivatedProps} props - 버튼 속성
 * @returns {JSX.Element} 버튼 요소
 *
 * @example
 * ```tsx
 * <RedSmallButtonActivated
 *   label="X"
 *   onClick={() => console.log("X 버튼 클릭됨")}
 * />
 * ```
 */
export function RedSmallButtonActivated({ label, onClick }: RedSmallButtonActivatedProps) {
  return (
    <button
      onClick={onClick}
      className="
        relative flex items-center justify-center
        w-[159px] h-[56px] p-0
        rounded-[15px] bg-error
        shadow-[0_8px_16px_-6px_rgba(0,82,103,0.32)]
        text-monochrome-lightgray text-body-06 leading-[19px] font-semibold tracking-[-0.6px]
        whitespace-pre-line
      "
    >
      {label}
    </button>
  );
}
