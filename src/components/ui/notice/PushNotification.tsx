"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

/**
 * PushNotificationProps
 * @typedef {Object} PushNotificationProps
 * @property {boolean} open - 알림의 표시 여부를 제어합니다. `true`일 때 알림이 표시됩니다.
 * @property {(open: boolean) => void} setOpen - 알림의 표시 상태를 변경하는 setter 함수입니다.
 * @property {string} message - 알림에 표시될 메시지 텍스트입니다.
 * @property {string} [timestamp] - 알림 우측 상단에 표시될 시간 정보입니다. (선택사항)
 * @property {() => void} [onClick] - 알림 클릭 시 실행될 콜백 함수입니다. (선택사항)
 */
interface PushNotificationProps {
  open: boolean
  setOpen: (open: boolean) => void
  message: string
  timestamp?: string
  onClick?: () => void
}

/**
 * PushNotification
 *
 * 상단에서 슬라이드 인/아웃 애니메이션과 함께 나타나는 푸시 알림 컴포넌트입니다.
 *
 * ### 특징
 * - `open` 상태를 기반으로 렌더링 및 애니메이션이 제어됩니다.
 * - createPortal을 사용하여 다른 레이아웃 요소에 영향을 주지 않습니다.
 * - 알림 클릭 시 `onClick` 콜백이 실행됩니다.
 * - 3초 후 자동으로 사라집니다.
 *
 * ### 시각적 구성
 * - 좌측: 파란색 원형 로고 아이콘
 * - 중앙: 메시지 텍스트
 * - 우측 상단: 타임스탬프 (선택사항)
 * - 배경: 흰색 카드 형태 (`bg-[#ffffff]`)
 *
 * @component
 * @param {PushNotificationProps} props - PushNotification 컴포넌트 속성
 * @returns {React.ReactPortal | null} 열림 상태일 경우 포털로 렌더링된 알림 요소, 닫힘 상태일 경우 `null`
 *
 * @example
 * \`\`\`tsx
 * const [open, setOpen] = useState(false)
 *
 * <PushNotification
 *   open={open}
 *   setOpen={setOpen}
 *   message="자녀 등록이 완료되었습니다."
 *   timestamp="오전 8:59"
 *   onClick={() => alert('알림이 클릭되었습니다.')}
 * />
 * \`\`\`
 */
export function PushNotification({ open, setOpen, message, timestamp, onClick }: PushNotificationProps) {
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      setIsAnimating(true)
      // 3초 후 자동으로 닫힘
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => setOpen(false), 300) // 애니메이션 완료 후 상태 변경
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [open, setOpen])

  /**
   * 알림 클릭 시 실행되는 이벤트 핸들러입니다.
   * onClick prop이 제공된 경우 해당 콜백을 실행합니다.
   */
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  if (!mounted || !open) return null

  return createPortal(
    <div
      // 포탈 컨테이너: 페이지와의 상호작용 간섭 방지
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 pointer-events-none"
    >
      {/* 애니메이션 래퍼: transform/opacity만 */}
      <div
        className={[
          "pointer-events-auto", // 이 안쪽만 클릭 가능
          "transition-transform transition-opacity duration-300 ease-out will-change-transform will-change-opacity",
          open && isAnimating ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        ].join(" ")}
      >
        {/* 카드: iOS 스타일(블러/보더/그라디언트) — 애니메이션 없음 */}
        <div
          onClick={handleClick}
          className="
          relative w-[357px] h-[90px] cursor-pointer
          rounded-lg
          bg-white/70 dark:bg-[#1c1c1e]/70
          backdrop-blur-3xl
          border border-white/30 dark:border-white/10
          shadow-[0_20px_40px_-20px_rgba(0,0,0,0.30),0_8px_16px_-8px_rgba(0,0,0,0.18)]
          ring-1 ring-black/5
          px-4 py-3
        "
          role="status" aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {/* 좌측 아이콘 */}
            <div className="flex-shrink-0">
              <div className="relative h-[60px] w-[60px] overflow-hidden rounded-lg bg-neutral-7 flex items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iU2YO3ROPMVvdndB1afLWpH35oP6IN.png"
                  alt="Notification bell"
                  className="h-[40px] w-[40px] object-contain"
                />
              </div>
            </div>

            {/* 우측 콘텐츠: 메시지 세로 중앙, 타임스탬프 우상단 */}
            <div className="relative flex-1">
              {/* 타임스탬프 (있을 때만) */}
              {timestamp && (
                <div className="absolute top-0 right-0 text-body-08 text-neutral-3">
                  {timestamp}
                </div>
              )}

              {/* 메시지 영역: 아이콘 높이(60px)에 맞춰 수직 중앙 정렬 */}
              <div className="h-[60px] pr-16 flex items-center">
                <p className="text-body-04 text-neutral-1 whitespace-pre-line ml-3">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
