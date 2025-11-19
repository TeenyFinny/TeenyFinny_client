"use client"

import Image from "next/image"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"

/**
 * 카드 상품 소개 페이지 컴포넌트입니다.
 *
 * 카드 발급 절차의 첫 번째 단계로, 사용자에게 카드 발급의 이점을 안내합니다.
 *
 * ### 특징
 * - 카드 발급 전 안내 화면을 표시합니다.
 * - "발급하기" 버튼 클릭 시 `onNext` 콜백을 호출하여 다음 단계로 진행합니다.
 * - 일러스트를 통해 사용자에게 친근한 경험을 제공합니다.
 *
 * ### 시각적 구성
 * - 상단: "TeenyFinny" 로고
 * - 제목: "카드로 금융의 첫 걸음 시작!"
 * - 부제: "카드를 만들기만 해도\n수수료 면제"
 * - 중앙: 카드 발급을 나타내는 일러스트 이미지
 * - 하단 버튼: "발급하기"
 *
 * @param {Step1IntroProps} props - 컴포넌트에 전달되는 props입니다.
 * @returns {React.ReactElement} 카드 상품 소개 페이지 UI
 *
 * @example
 * ```tsx
 * <Step01CardIntro onNext={() => setStep(2)} />
 * ```
 */

interface Step1CardIntroProps {
  onNext: () => void // 이게 핵심
}
export default function Step01CardIntro({ onNext }: Step1CardIntroProps) {
  /**
   * 발급하기 버튼 클릭 시 step2 페이지로 이동하는 핸들러입니다.
   */

  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <div className="mt-[47px] text-center">
        <h1 className="text-account-title text-primary-1">TeenyFinny</h1>
        <h2 className="text-head-01 text-neutral-1 whitespace-pre-line">카드로 금융의 첫 걸음 시작!</h2>
      </div>

      {/* 부제 */}
      <div className="mt-[33px] mb-[20px] space-y-[24px] text-center">
        <p className="text-head-05 text-neutral-2 whitespace-pre-line">{"카드를 만들기만 해도\n수수료 면제"}</p>
      </div>

      {/* 토끼와 코인 이미지 */}
      <div className="flex justify-center">
        <div className="relative h-[312px] w-[312px]">
          <Image
            src="/images/allowance/illust_allowance_makecard.png"
            alt="입출금 계좌"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-[327px]">
        <BigButtonActivated label="발급하기" onClick={onNext}/>
      </div>
    </div>
  )
}
