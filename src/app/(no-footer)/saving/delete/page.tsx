"use client"

import { useRouter } from "next/navigation"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated"
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled"

export default function DeleteConfirmationPage() {
  const router = useRouter()

  // ✅ "네" 클릭 → 재확인 페이지로 이동
  const handleConfirm = () => {
    router.push("/saving/delete/reconfirm")
  }

  // ✅ "아니요" 클릭 → 적금 상세 페이지로 복귀
  const handleCancel = () => {
    router.push("/saving/detail")
  }

  return (
    <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
      <main className="flex flex-col items-center px-6">
        {/* Title */}
        <h1 className="mt-[73px] text-landing-01 text-primary-1">
          정말 삭제할까요?
        </h1>

        {/* Character Illustration */}
        <div className="mt-4 flex justify-center">
          <img
            src="/images/saving/illust_saving_5.png"
            alt="슬픈 토끼 캐릭터"
            className="h-[300px] w-[300px] object-contain"
          />
        </div>

        {/* Warning Text - 단일 텍스트 블록 */}
        <p className="mt-3.5 text-head-05 text-neutral-2 whitespace-pre-line">
          지금 삭제하면…{"\n"}
          <span className="text-primary-3">♥</span> 최대 이자를 받을 수 없어요!{"\n"}
          <span className="text-primary-3">♥</span> 부모님의 허가를 받아야 해요!{"\n"}
          <span className="text-primary-3">♥</span> 은행에 방문해야 해지할 수 있어요!
        </p>

        {/* Buttons */}
        <div className="mt-17 flex gap-2.5 px-6">
          {/* "네" → 재확인 페이지 */}
          <SmallButtonDisabled label="네" onClick={handleConfirm} />
          {/* "아니요" → 상세 페이지로 복귀 */}
          <SmallButtonActivated label="아니요" onClick={handleCancel} />
        </div>
      </main>
    </div>
  )
}
