"use client"
import { useRouter, useSearchParams } from "next/navigation";

import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"



export default function CreateInvestAccount() {
    const router = useRouter();
  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        {/* Title */}
        <h1 className="text-center">
          <span className="text-account-title text-primary-1 block">우리투자증권</span>
        </h1>

        {/* Subtitle */}
        <p className="text-head-01 text-neutral-1 text-center mb-8">우리 아이 투자의 첫 걸음 시작!</p>

        {/* Description */}
        <div className="text-center mb-1">
          <p className="text-head-05 text-neutral-2 leading-relaxed">
            계좌를 만들기만 하면
            <br />
            주식 크레딧 증정
          </p>
        </div>

        {/* Illustration */}
        <div className=" flex justify-center mb-21">
          <img
            src="/images/invest/illust_invest_1.png"
            alt="토끼가 금화를 들고 있는 일러스트"
            className="w-[312px] h-[312px] object-contain"
          />
        </div>
        <BigButtonActivated label="개설하기" onClick={() => router.push("/invest/moveToInvest")}/>
      </main>
    </div>
  )
}
