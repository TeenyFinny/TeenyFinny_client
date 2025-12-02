"use client"

import { StateBadge } from "@/components/ui/badge/StateBadge"
import { TinyStateBadge } from "@/components/ui/badge/TinyStateBadge"



export default function BadgeTest() {
  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/** title */}
        <h1 className="text-head-03 text-[#343434] whitespace-pre-line">{"상태 버튼 테스트"}</h1>

        {/** enabled button */}
        <div className="space-y-4">
          <h2 className="text-head-06 text-[#343434]">활성화된 버튼</h2>
          <StateBadge enabled={true} label="용돈조르기" onClick={() => alert("버튼 클릭됨")} />
          <p className="text-body-07 text-[#989898]">클릭 시 "버튼 클릭됨" 알림이 표시됩니다.</p>
        </div>

        {/** disabled button */}
        <div className="space-y-4">
          <h2 className="text-head-06 text-[#343434]">비활성화된 버튼</h2>
          <StateBadge enabled={false} label="용돈조르기" onClick={() => alert("이 알림은 표시되지 않습니다")} />
          <p className="text-body-07 text-[#989898]">클릭해도 아무 이벤트가 발생하지 않습니다.</p>
        </div>

        {/** title */}
        <h1 className="text-head-03 text-[#343434] whitespace-pre-line">{"미니 상태 버튼 테스트"}</h1>

        {/** enabled button */}
        <div className="space-y-4">
          <h2 className="text-head-06 text-[#343434]">활성화된 버튼</h2>
          <TinyStateBadge enabled={true} label="카드" onClick={() => alert("버튼 클릭됨")} />
          <p className="text-body-07 text-[#989898]">클릭 시 "버튼 클릭됨" 알림이 표시됩니다.</p>
        </div>

        {/** disabled button */}
        <div className="space-y-4">
          <h2 className="text-head-06 text-[#343434]">비활성화된 버튼</h2>
          <TinyStateBadge enabled={false} label="카드" onClick={() => alert("이 알림은 표시되지 않습니다")} />
          <p className="text-body-07 text-[#989898]">클릭해도 아무 이벤트가 발생하지 않습니다.</p>
        </div>
      </div>
    </div>
  )
}
