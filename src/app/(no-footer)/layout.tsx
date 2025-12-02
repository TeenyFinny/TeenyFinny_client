// app/(auth)/layout.tsx
"use client";

import HeaderbarWrapper from "@/components/layout/headerbar/HeaderbarWrapper";
import { useUserStore } from "@/store/userStore";
import { useSse } from "@/hooks/useSse";
import { PushNotification } from "@/components/ui/notice/PushNotification";
import { useNotificationStore } from "@/store/notificationStore";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userType } = useUserStore();
  const { message, setMessage } = useNotificationStore();
  useSse();

  return (
    // 화면 전체를 '상태바 44px + 헤더 56px + 컨텐츠' 3행으로 분리
    <div className="w-full h-full bg-neutral-3 flex justify-center">
      <div className="w-[375px] h-dvh bg-primary-4 grid grid-rows-[44px_56px_1fr] overflow-hidden">
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

        {/* Row 2: 헤더 */}
        <div className="w-full flex justify-center">
          <div className="w-full">
            <HeaderbarWrapper />
          </div>
        </div>

        {/* Row 3: 컨텐츠 */}
        <section className="w-full flex justify-center overflow-y-auto">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </div>
  );
}
