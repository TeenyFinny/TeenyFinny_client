// app/(auth)/layout.tsx
"use client";

import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 화면 전체를 '상태바 44px + 컨텐츠' 행으로 분리
    <div className="w-full h-full bg-primary-4 flex justify-center">
      <div className="w-[375px] h-dvh bg-primary-4 grid grid-rows-[44px_1fr] overflow-hidden">
        {/* Row 1: 상태바 */}
        <div className="w-full h-[44px] relative">
          <Image src="/images/common/illust_common_status_bar.png" alt="status bar" className="object-cover" fill priority />
        </div>
        {/* Row 2: 컨텐츠 */}
        <section className="w-full flex justify-center overflow-y-auto">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </div>
  );
}
