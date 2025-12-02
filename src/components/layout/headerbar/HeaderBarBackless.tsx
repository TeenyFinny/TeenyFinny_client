"use client"
import Image from "next/image"

/**
 * HeaderBarProps
 * @typedef {Object} HeaderBarProps
 * @property {() => void} onNotificationClick - 알림(종) 버튼 클릭 시 실행될 콜백 함수입니다.
 */
interface HeaderBarProps {
  onNotificationClick: () => void
}

/**
 * HeaderBarBackless
 *
 * 화면 상단에 표시되는 헤더 바 컴포넌트입니다.
 *
 * ### 특징
 * - 오른쪽에 알림 버튼만 표시됩니다.
 * - 깔끔한 흰색 배경에 회색 아이콘으로 구성됩니다.
 *
 * ### 시각적 구성
 * - 흰색 배경(`bg-primary-4`)
 * - 좌우 패딩과 적절한 높이로 구성
 * - 알림 아이콘은 오른쪽 정렬
 *
 * @component
 * @param {HeaderBarProps} props - HeaderBar 컴포넌트 속성
 * @returns {React.ReactElement} 헤더 바 요소
 *
 * @example
 * ```tsx
 * <HeaderBar
 *   onNotificationClick={() => alert("알림 클릭")}
 * />
 * ```
 */
import { useEffect } from "react"
import { useNotificationStore } from "@/store/notificationStore"

export function HeaderBarBackless({ onNotificationClick }: HeaderBarProps) {
  const { hasUnread, checkUnread } = useNotificationStore()

  useEffect(() => {
    checkUnread()
  }, [checkUnread])

  return (
    <header className="w-full bg-primary-4 border-primary-4">
      {/* 높이 56px, 좌우 패딩 12px */}
      <div className="flex h-14 items-center justify-end pr-3">
        {/** 알림 버튼 */}
        <button
          onClick={onNotificationClick}
          className="relative flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-70 active:opacity-50"
          aria-label="알림"
        >
          <Image
            src="/icons/notice.png"
            alt="알림"
            width={24}
            height={24}
            className="w-6 h-6 -scale-x-100"
          />
          {hasUnread && (
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
          )}
        </button>
      </div>
    </header>
  )
}
