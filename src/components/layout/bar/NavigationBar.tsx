"use client"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

/**
 * @typedef NavigationBarProps
 * @property {"parent" | "child" | "admin" | null} userType
 *   사용자 타입
 *   - "parent": 부모용 네비게이션
 *   - "child": 자녀용 네비게이션
 *   - "admin" | null: 현재는 사용되지 않음
 * @property {(page: string) => void} [onNavigate] 아이콘 클릭 시 호출되는 콜백 함수
 * @property {boolean} [disabled] true일 경우 네비게이션 바를 렌더링하지 않음
 */
interface NavigationBarProps {
  userType: "parent" | "child" | "admin" | null
  onNavigate?: (page: string) => void
  disabled?: boolean
}

/**
 * NavigationBar
 *
 * 하단 고정 네비게이션 바 컴포넌트
 *
 * - 부모(parent)와 자녀(child) 타입에 따라 아이콘 개수가 다릅니다.
 * - activePaths 배열을 통해, 경로가 포함되면 아이콘이 하이라이트됩니다.
 * - 클릭 시 onNavigate 콜백과 router.push(path) 호출
 *
 * ### 사용 가이드
 * - 각 navItem에 `activePaths` 배열을 넣어주세요.
 * - `pathname.startsWith()`를 사용하므로, 하위 페이지 경로도 자동으로 포함됩니다.
 * - 예: `/quiz` 아이콘을 하이라이트하려면 `activePaths: ["/quiz"]` 처럼 작성
 *
 * @param props NavigationBarProps
 * @returns React.ReactElement | null
 */
export function NavigationBar({
  userType,
  onNavigate,
  disabled = false,
}: NavigationBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (disabled) return null

  /** 부모용 네비게이션 아이템 */
  const parentNavItems = [
    {
      path: "/home",
      label: "홈",
      iconPath: "/icons/home.png",
      activePaths: ["/home", "/family"], // 하위 페이지 없으면 path 그대로
    },
    {
      path: "/account",
      label: "아이관리",
      iconPath: "/icons/child-management.png",
      activePaths: ["/account", "/allowance"],
    },
    {
      path: "/profile",
      label: "마이페이지",
      iconPath: "/icons/mypage.png",
      activePaths: ["/profile"], 
    },
  ]

  /** 자녀용 네비게이션 아이템 */
  const childNavItems = [
    {
      path: "/home",
      label: "홈",
      iconPath: "/icons/home.png",
      activePaths: ["/home", "/family", "/allowance"],
    },
    {
      path: "/quiz",
      label: "퀴즈",
      iconPath: "/icons/quiz.png",
      activePaths: ["/quiz"], // /quiz/*= 포함
    },
    {
      path: "/invest",
      label: "투자",
      iconPath: "/icons/investment.png",
      activePaths: ["/invest"],
    },
    {
      path: "/profile",
      label: "마이페이지",
      iconPath: "/icons/mypage.png",
      activePaths: ["/profile"],
    },
  ]

  const navItems = userType === "parent" ? parentNavItems : childNavItems

  /** 클릭 핸들러 */
  const handleNavigate = (path: string) => {
    if (onNavigate) onNavigate(path)
    router.push(path)
  }

  /** 아이콘 하이라이트 여부 판단 */
  const isActive = (paths: string[]) => paths.some(p => pathname.startsWith(p))
  const highlightColor = "bg-primary-1" // 활성 아이콘 색상

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[375px] bg-transparent">
      <div className="relative bg-neutral-7 h-[86px] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-around h-[56px] pt-[4px] bg-neutral-7">
          {navItems.map((item) => {
            const active = isActive(item.activePaths)
            const iconColor = active ? highlightColor : "bg-neutral-4"
            const textColor = active ? "bg-neutral-1" : "bg-neutral-4"

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center justify-start gap-[6px] transition-opacity hover:opacity-80 active:opacity-60"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
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
                      filter: active
                        ? "brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2000%) hue-rotate(188deg) brightness(90%) contrast(105%)"
                        : "grayscale(100%) brightness(90%)",
                    }}
                  />
                </div>

                {/* 텍스트 */}
                <span
                  className="font-semibold text-nav-title leading-[18px] tracking-[-0.12px] text-center"
                  style={{ color: textColor }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
