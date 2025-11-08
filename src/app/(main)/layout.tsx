"use client"

import { NavigationBar } from "@/components/layout/bar/NavigationBar"
import HeaderbarWrapper from "@/components/layout/headerbar/HeaderbarWrapper"
import { useUserStore } from "@/store/userStore"
import type React from "react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userType } = useUserStore()

  return (
    // 화면 전체를 '상태바 44px + 헤더 56px + 컨텐츠 + 푸터 86px' 4행으로 분리
    <div className="w-full h-full bg-primary-4 flex justify-center">
      <div className="w-full h-dvh bg-primary-4 grid grid-rows-[44px_56px_1fr_86px] overflow-hidden">
        {/* Row 1: 상태바 */}
        <div className="w-full h-[44px] relative">
          <img
            src="/images/common/illust_common_status_bar.png"
            alt="status bar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Row 2: 헤더 */}
        <div className="w-full flex justify-between">
          <div className="w-full">
            <HeaderbarWrapper />
          </div>
        </div>

        {/* Row 3: 컨텐츠 */}
        <section className="w-full flex overflow-y-auto bg-primary-4">{children}</section>

        {/* Row 4: 푸터 */}
        <section className="w-full flex justify-center overflow-y-auto">
          <NavigationBar userType={userType} onNavigate={() => null} disabled={false} />
        </section>
      </div>
    </div>
  )
}
