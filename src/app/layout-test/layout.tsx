'use server'

import { HeaderBar } from "@/components/ui/headerbar/HeaderBar";
import HeaderbarWrapper from "@/components/ui/headerbar/HeaderbarWrapper";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // 화면 전체를 '헤더 56px + 컨텐츠' 2행으로 분리
    <div className="w-screen h-dvh bg-neutral-6 grid grid-rows-[56px_1fr] overflow-hidden">
      {/* Row 1: 헤더 */}
      <div className="w-full">
        <div className="w-full flex justify-center px-6">
          <div className="w-[375px]">
            <HeaderbarWrapper />
          </div>
        </div>
      </div>

      {/* Row 2: 컨텐츠 */}
      <section className="overflow-y-auto">
        <div className="w-full flex justify-center px-6">
          <div className="w-[375px]">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
