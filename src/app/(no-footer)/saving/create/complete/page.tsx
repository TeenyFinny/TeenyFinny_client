"use client"

import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useUserStore } from "@/store/userStore"

export default function SavingAccountCreateCompletePage() {
  const router = useRouter()
  const { userType } = useUserStore()


  // ✅ 버튼 클릭 시 userType별로 다른 페이지로 이동
  const handleClick = () => {
    router.push("/home")
  }

  return (
    <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
      <main className="flex flex-1 flex-col items-center px-6">
        {/* Title */}

        <div className="mt-31 flex justify-center">
          <img
            src="/icons/check-primary-1.png"
            alt="파란 체크 이미지"
            className="h-[40px] w-[41px] object-contain"
          />
        </div>
        
        <div className="mt-4 text-center">
             <span className="text-head-01 text-neutral-1">
              목표 적금에 <br />
              가입했어요!
            </span>
        </div>

        {/* Character Illustration */}
        <div className="mt-4 flex justify-center">
          <img
            src="/images/common/illust_common_1.png"
            alt="티니피니 이미지"
            className="h-[233px] w-[350px] object-contain"
          />
        </div>

        {/* Buttons */}
        <div className="mt-[113px] flex gap-2.5 px-6">
          <BigButtonActivated label="홈으로 돌아가기" onClick={handleClick} />
        </div>
      </main>
    </div>
  )
}
