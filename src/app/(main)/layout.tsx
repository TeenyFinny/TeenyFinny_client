// app/(main)/layout.tsx
"use client"
import { NavigationBar } from "@/components/layout/bar/NavigationBar";
import HeaderbarWrapper from "@/components/layout/headerbar/HeaderbarWrapper";
import { useUserStore } from "@/store/userStore";
import React from "react"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userType } = useUserStore()

    return (
        // 화면 전체를 '헤더 56px + 컨텐츠' 2행으로 분리
        <div className="w-full h-full bg-neutral-3 flex justify-center">
            <div className="w-full h-dvh bg-neutral-7 grid grid-rows-[56px_1fr_86px] overflow-hidden">
                {/* Row 1: 헤더 */}
                <div className="w-full flex justify-between">
                    <div className="w-full">
                        <HeaderbarWrapper />
                    </div>
                </div>

                {/* Row 2: 컨텐츠 */}
                <section className="w-full flex overflow-y-auto">
                    {children}
                </section>

                {/* Row 3: 푸터 */}
                <section className="w-full flex justify-center overflow-y-auto">
                    <NavigationBar
                        userType={userType}
                        onNavigate={() => null}
                        disabled={false}
                    />
                </section>
            </div>
        </div>
    );
}
