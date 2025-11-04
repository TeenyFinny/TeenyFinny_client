"use client"
import Image from "next/image"

/**
 * HeaderBarProps
 * @typedef {Object} HeaderBarProps
 * @property {() => void} onBackClick - 뒤로가기 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {() => void} onNotificationClick - 알림(종) 버튼 클릭 시 실행될 콜백 함수입니다.
 */
interface HeaderBarProps {
  onBackClick: () => void
  onNotificationClick: () => void
}

/**
 * HeaderBar
 *
 * 화면 상단에 표시되는 헤더 바 컴포넌트입니다.
 *
 * ### 특징
 * - 왼쪽에 뒤로가기 버튼, 오른쪽에 알림 버튼이 배치됩니다.
 * - 각 버튼 클릭 시 props로 전달받은 콜백 함수가 실행됩니다.
 * - 깔끔한 흰색 배경에 회색 아이콘으로 구성됩니다.
 *
 * ### 시각적 구성
 * - 흰색 배경(`bg-[#ffffff]`)
 * - 좌우 패딩과 적절한 높이로 구성
 * - 뒤로가기 아이콘(왼쪽)과 알림 아이콘(오른쪽)
 *
 * @component
 * @param {HeaderBarProps} props - HeaderBar 컴포넌트 속성
 * @returns {React.ReactElement} 헤더 바 요소
 *
 * @example
 * ```tsx
 * <HeaderBar
 *   onBackClick={() => alert("뒤로가기 클릭")}
 *   onNotificationClick={() => alert("알림 클릭")}
 * />
 * ```
 */
export function HeaderBar({ onBackClick, onNotificationClick }: HeaderBarProps) {
  return (
    <header className="w-full bg-[#ffffff] border-[#e8ebee]">
      {/* 높이 56px, 좌 12px / 우 20px 패딩 */}
      <div className="flex h-14 items-center justify-between pl-3 pr-5">
        {/** 뒤로가기 버튼 */}
        <button
          onClick={onBackClick}
          className="flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-70 active:opacity-50"
          aria-label="뒤로가기"
        >
          <Image
            src="/icons/back.png"
            alt="뒤로가기"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        {/** 알림 버튼 */}
        <button
          onClick={onNotificationClick}
          className="flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-70 active:opacity-50"
          aria-label="알림"
        >
          <Image
            src="/icons/notice.png"
            alt="알림"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      </div>
    </header>
  )
}
