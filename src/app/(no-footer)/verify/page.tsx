"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VerificationForm from "@/components/custom/verification/VerificationForm"
import { useUserStore } from "@/store/userStore"
import { getProfileInfo } from "@/lib/api/profile"

export default function VerifyPage() {
  const router = useRouter()
  const userId = useUserStore((state) => state.userId)
  const [initialProfile, setInitialProfile] = useState<{
    name: string
    phoneNumber: string
  } | null>(null)

  // userId가 없을 때 리다이렉트 처리
  useEffect(() => {
    if (!userId) {
      router.push("/")
    }
  }, [userId, router])

  // 프로필 정보 로드 (update 모드 초기값용)
  useEffect(() => {
    if (!userId) return

    const controller = new AbortController()
    const loadProfile = async () => {
      try {
        const data = await getProfileInfo(controller.signal)
        if (!controller.signal.aborted && data?.user) {
          setInitialProfile({
            name: data.user.name || "",
            phoneNumber: data.user.phoneNumber || "",
          })
        }
      } catch (err: any) {
        if (!controller.signal.aborted && process.env.NODE_ENV === "development") {
          console.error("프로필 정보를 불러오지 못했습니다.", err)
        }
      }
    }

    loadProfile()
    return () => controller.abort()
  }, [userId])

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
      <VerificationForm
        mode="update"
        form={initialProfile || undefined}
        onSuccess={() => router.push("/profile/mypage")}
      />
    </div>
  )
}
