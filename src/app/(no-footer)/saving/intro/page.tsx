"use client"

import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useUserStore } from "@/store/userStore"

export default function DeleteReconfirmationPage() {
  const router = useRouter()
  const { userType } = useUserStore()

  // ✅ 사용자 타입에 따른 버튼 문구 분기
  const buttonLabel =
    userType === "parent" ? "목표 적금 개설하기" : "목표 생성하기"

  // ✅ 버튼 클릭 시 userType별로 다른 페이지로 이동
  const handleClick = () => {
    if (userType === "parent") {
      router.push("/saving/create/account")
    } else {
      router.push("/saving/create")
    }
  }

  return (
    <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
      <main className="flex flex-1 flex-col items-center px-6">
        {/* Title */}
        <div className="mt-12 text-center">
          <div className="text-head-01 text-neutral-1">
            <span className="text-account-title text-primary-1">
              WON<br />
            </span>
            <span>목표 적금</span>
          </div>
        </div>

        {/* Interest Rates */}
        <div className="mt-8 space-y-4">
          <div className="text-head-06 text-neutral-1">
            <span className="text-primary-3">♥</span>
            <span> 최대 연 5.00%</span>
            <span className="text-body-08 text-neutral-3"> 적금 만기 해지 시</span>
          </div>

          <div className="text-head-06 text-neutral-1">
            <span className="text-primary-3">♥</span>
            <span> 기본 연 2.00%</span>
            <span className="text-body-08 text-neutral-3"> 시작만 해도</span>
          </div>
        </div>

        {/* Character Illustration */}
        <div className="mt-17 flex justify-center">
          <img
            src="/images/common/illust_common_1.png"
            alt="슬픈 토끼 캐릭터"
            className="h-[233px] w-[350px] object-contain"
          />
        </div>

        {/* Buttons */}
        <div className="mt-[93px] flex gap-2.5 px-6">
          <BigButtonActivated label={buttonLabel} onClick={handleClick} />
        </div>
      </main>
    </div>
  )
}
