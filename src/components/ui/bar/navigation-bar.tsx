"use client"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

/**
 * NavigationBarProps
 * @typedef {Object} NavigationBarProps
 * @property {"parent" | "child"} userType - 사용자 타입. "parent"는 3개 아이콘, "child"는 4개 아이콘을 표시합니다.
 * @property {(page: string) => void} [onNavigate] - 아이콘 클릭 시 실행될 콜백 함수입니다.
 * @property {boolean} [disabled] - 네비게이션 바의 활성화 여부입니다. `true`일 경우 표시되지 않습니다.
 */
interface NavigationBarProps {
  userType: "parent" | "child"
  onNavigate?: (page: string) => void
  disabled?: boolean
}

/**
 * NavigationBar
 *
 * 하단 고정 네비게이션 바 컴포넌트
 * - 부모: 3개 아이콘
 * - 자녀: 4개 아이콘
 * - 활성화 색상은 고정 (#0067AC)
 */
export function NavigationBar({
  userType,
  onNavigate,
  disabled = false,
}: NavigationBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (disabled) return null

  /** 네비게이션 아이템 */
  const parentNavItems = [
    { path: "/home", label: "홈", iconPath: "/icons/home.png" },
    { path: "/child-management", label: "아이관리", iconPath: "/icons/child-management.png" },
    { path: "/mypage", label: "마이페이지", iconPath: "/icons/mypage.png" },
  ]

  const childNavItems = [
    { path: "/home", label: "홈", iconPath: "/icons/home.png" },
    { path: "/lee-test", label: "퀴즈", iconPath: "/icons/quiz.png" },
    { path: "/investment", label: "투자", iconPath: "/icons/investment.png" },
    { path: "/mypage", label: "마이페이지", iconPath: "/icons/mypage.png" },
  ]

  const navItems = userType === "parent" ? parentNavItems : childNavItems

  /** 클릭 핸들러 */
  const handleNavigate = (path: string) => {
    if (onNavigate) onNavigate(path)
    router.push(path)
  }

  /** 고정 색상 정의 */
  const highlightColor = "#0067AC"

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[375px] bg-transparent">
      {/* 전체 Base */}
      <div className="relative bg-[#ffffff] h-[86px] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        {/* 상단 흰색 영역 */}
        <div className="flex items-start justify-around h-[56px] pt-[4px] bg-[#ffffff]">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            const iconColor = isActive ? highlightColor : "#CACACA"
            const textColor = isActive ? "#343434" : "#CACACA"

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center justify-start gap-[6px] transition-opacity hover:opacity-80 active:opacity-60"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* 아이콘 */}
                <div className="flex items-center justify-center w-[28px] h-[28px]">
                  <Image
                    src={item.iconPath || "/placeholder.svg"}
                    alt={item.label}
                    width={28}
                    height={28}
                    className="w-[28px] h-[28px]"
                    style={{
                      filter: isActive
                        ? "brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2000%) hue-rotate(188deg) brightness(90%) contrast(105%)"
                        : "grayscale(100%) brightness(90%)",
                    }}
                  />
                </div>

                {/* 텍스트 */}
                <span
                  className="font-semibold text-[10px] leading-[18px] tracking-[-0.12px] text-center"
                  style={{ color: textColor }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* 하단 회색 Base + Home Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[30px] bg-[#f8f8f8]">
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full" />
        </div>
      </div>
    </nav>
  )
}
