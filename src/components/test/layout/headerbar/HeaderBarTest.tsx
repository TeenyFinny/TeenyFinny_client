"use client"

import { HeaderBar } from "@/components/layout/headerbar/HeaderBar"



export default function HeaderBarTest() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/** Added HeaderBar component at the top */}
      <HeaderBar onBackClick={() => alert("뒤로가기 클릭됨")} onNotificationClick={() => alert("알림 클릭됨")} />

      {/** Content area */}
      <div className="p-6">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-head-03 text-[#343434]">헤더 바 테스트</h1>
          <p className="text-body-07 text-[#989898] whitespace-pre-line">
            {
              "상단의 헤더 바에서:\n- 왼쪽 화살표를 클릭하면 '뒤로가기 클릭됨' 알림이 표시됩니다.\n- 오른쪽 종 아이콘을 클릭하면 '알림 클릭됨' 알림이 표시됩니다."
            }
          </p>
        </div>
      </div>
    </div>
  )
}
