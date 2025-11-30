"use client"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import Image from "next/image"
import { useRouter } from "next/navigation";

export default function Complete() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-between px-6 pb-6 pt-20">
      {/* Success Icon and Message */}
      <div className="flex flex-col items-center">
        {/* Blue Checkmark Icon */}
        <div className="flex h-16 w-16 items-center justify-center mb-4">
          <img src="/images/invest/icon_invest_check.png" alt="체크 이미지" />
        </div>

        {/* Success Message */}
        <h1 className="text-center text-head-01 text-neutral-1">
          주식 계좌를
          <br />
          개설했어요!
        </h1>

        {/* Illustration */}
        <div className="relative mt-4 w-[352px] h-[235px]">
          <Image
            src="/images/common/illust_common_1.png"
            alt="Bear and rabbit celebrating with money"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        <BigButtonActivated label="투자 홈으로 돌아가기" onClick={() => router.push("/home")}></BigButtonActivated>
      </div>
    </div>
  )
}
