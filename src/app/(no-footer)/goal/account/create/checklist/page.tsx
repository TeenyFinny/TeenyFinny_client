"use client"

import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import Image from "next/image"

export default function GoalAccountCreateChecklistPage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/goal/account/create/agreement")
  }

  return (
    <div className="flex flex-col px-[24px]">
      {/* 제목 */}
      <div className="mt-[43px] mb-[24px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"계좌 개설 전에\n미리 확인해 주세요"}
        </h1>
      </div>

      {/* 설명 */}
      <div className="mb-[24px]">
        <div className="space-y-[6px] text-left whitespace-pre-line">
          <h2 className="text-head-04 text-neutral-1">알아서 준비해주는 서류</h2>
          <p className="text-body-07 text-neutral-1">
            필요한 서류는 스크래핑을 통해 대부분 자동 발급되니까{" "}
            <span className="text-primary-1">부모님 본인 명의 휴대폰, 신분증</span>만 준비하면
            빠른 개설이 가능해요.
          </p>
        </div>
      </div>

      {/* 이미지 */}
      <div className="flex flex-1 items-center justify-center mb-[65px]">
        <div className="relative h-[310px] w-[310px]">
          <Image
            src="/images/saving/illust_saving_7.png"
            alt="준비사항"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="absolute bottom-14 left-0 right-0 flex flex-col gap-5 items-center px-[24px]">
        <BigButtonActivated label="네, 확인했어요" onClick={handleNext} />
      </div>
    </div>
  )
}
