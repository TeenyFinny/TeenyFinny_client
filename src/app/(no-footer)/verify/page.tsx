"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import VerificationForm from "@/components/custom/verification/VerificationForm"
import { useUserStore } from "@/store/userStore"

export default function VerifyPage() {
  const router = useRouter()
  const userId = useUserStore((state) => state.userId)

  // userId가 없을 때 리다이렉트 처리
  useEffect(() => {
    if (!userId) {
      router.push("/")
    }
  }, [userId, router])

  // userId가 없으면 아무것도 렌더링하지 않음
  if (!userId) {
    return (
      <div className="flex flex-col h-full px-[27px] items-center justify-center">
        <p className="text-body-01 text-neutral-3">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full px-[27px]">
      <VerificationForm mode="verify" onSuccess={() => router.push("/profile/mypage")} />
    </div>
  )
}
