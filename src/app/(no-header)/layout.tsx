// app/(no-header)/layout.tsx
"use client";

import React from "react";
import { useUserStore } from "@/store/userStore";
import { NavigationBar } from "@/components/layout/bar/NavigationBar"
import { useSse } from "@/hooks/useSse"
import { PushNotification } from "@/components/ui/notice/PushNotification";
import { useNotificationStore } from "@/store/notificationStore";

export default function NoHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userType } = useUserStore();
  const { message, setMessage } = useNotificationStore();
  useSse(); // SSE 연결 활성화

  return (
    // 전체 화면: 상단 상태바 + 컨텐츠 + 하단 네비게이션
    <div className="w-full h-full bg-neutral-3 flex justify-center">
      <div className="w-[375px] h-dvh bg-primary-4 flex flex-col overflow-hidden ">
        <PushNotification
          open={!!message}
          setOpen={(open) => {
            if (!open) setMessage(null)
          }}
          message={message || ""}
        />
        {/* Row 1: 상태바 */}
        <div className="w-full h-[44px] relative">
          <img
            src="/images/common/illust_common_status_bar.png"
            alt="status bar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Row 2: 컨텐츠 */}
        <section className="flex-1 overflow-y-auto">
          {children}
        </section>

        {/* Row 3: 하단 네비게이션 */}
        <div className="h-[86px] flex-shrink-0">
          <NavigationBar
            userType={userType}
            onNavigate={() => null}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
