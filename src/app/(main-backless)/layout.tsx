"use client"

import { NavigationBar } from "@/components/layout/bar/NavigationBar"
import HeaderbarBacklessWrapper from "@/components/layout/headerbar/HeaderBarBacklessWrapper"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useUserStore } from "@/store/userStore"
import { useSse } from "@/hooks/useSse"
import { PushNotification } from "@/components/ui/notice/PushNotification"
import { useNotificationStore } from "@/store/notificationStore"
import type React from "react"

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userType } = useUserStore()
  useRequireAuth("/login") // 리다이렉트만 처리, 반환값은 사용하지 않음

  const { message, setMessage } = useNotificationStore()
  useSse()

  return (
    // 전체를 중앙에 고정된 375×812 모바일 프레임으로
    <div className="flex justify-center bg-primary-4 min-h-screen">
      <div className="w-[375px] h-[812px] bg-primary-4 flex flex-col overflow-hidden">
        <PushNotification
          open={!!message}
          setOpen={(open) => {
            if (!open) setMessage(null)
          }}
          message={message || ""}
        />
        {/* ✅ 상태바 */}
        <div className="h-[44px] w-full relative flex-shrink-0">
          <img src="/images/common/illust_common_status_bar.png" alt="status bar" className="w-full h-full object-cover" />
        </div>

        {/* ✅ 헤더 */}
        <div className="h-[56px] flex-shrink-0">
          <HeaderbarBacklessWrapper />
        </div>

        {/* ✅ 컨텐츠 (여기만 스크롤 가능) */}
        <div className="flex-1 overflow-y-auto bg-primary-4">{children}</div>

        {/* ✅ 푸터 */}
        <div className="h-[86px] flex-shrink-0">
          <NavigationBar userType={userType} onNavigate={() => null} disabled={false} />
        </div>
      </div>
    </div>
  )
}
