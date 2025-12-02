"use client"

import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"

interface Step06CompleteProps {
  onNext: () => void
}

export default function Step06Complete({ onNext }: Step06CompleteProps) {
  return (
    <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
      <main className="flex flex-1 flex-col items-center px-6">
        
        {/* 성공 아이콘 */}
        <div className="mt-31 flex justify-center">
          <img
            src="/icons/check-primary-1.png"
            alt="완료 체크 아이콘"
            className="h-[40px] w-[41px] object-contain"
          />
        </div>
        
        {/* 텍스트 */}
        <div className="mt-4 text-center">
          <span className="text-head-01 text-neutral-1">
            목표 적금에 <br />
            가입했어요!
          </span>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="mt-4 flex justify-center">
          <img
            src="/images/common/illust_common_1.png"
            alt="티니피니 캐릭터"
            className="h-[233px] w-[350px] object-contain"
          />
        </div>

        {/* 버튼 */}
        <div className="absolute bottom-14 flex gap-2.5 px-6">
          <BigButtonActivated label="홈으로 돌아가기" onClick={onNext} />
        </div>
      </main>
    </div>
  )
}
