"use client"

import Image from "next/image"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"

/**
 * Page
 *
 * WON 계좌 개설 시작 페이지 컴포넌트입니다.
 *
 * ### 특징
 * - 계좌 개설 전 안내 화면을 표시합니다.
 * - "개설하기" 버튼 클릭 시 step2 페이지로 라우팅됩니다.
 * - 일러스트를 통해 친근한 UX를 제공합니다.
 *
 * ### 시각적 구성
 * - 상단: "WON" 로고 텍스트 (파란색, #0067ac)
 * - 제목: "통장으로 금융의 첫 걸음 시작!" (검정색)
 * - 부제: "계좌를 만들기만 해도\n수수료 면제" (회색)
 * - 중앙: 토끼와 코인 일러스트 이미지
 * - 하단 안내: "자녀가 보유한 계좌가 없습니다." (회색)
 * - 하단 버튼: "개설하기" (파란색 배경, 흰색 텍스트)
 *
 * @component
 * @returns {React.ReactElement} 계좌 개설 시작 페이지
 *
 * @example
 * \`\`\`tsx
 * // app/page.tsx에서 직접 사용
 * export default function Page() {
 *   return <Page />
 * }
 * \`\`\`
 */

interface Step1IntroProps {
  onNext: () => void // 이게 핵심
}
export default function Step01Intro({ onNext }: Step1IntroProps) {
  /**
   * 개설하기 버튼 클릭 시 step2 페이지로 이동하는 핸들러입니다.
   */

  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <div className="mt-[47px] text-center">
        <h1 className="text-account-title text-primary-1">TeenyFinny</h1>
        <h2 className="text-head-01 text-neutral-1 whitespace-pre-line">통장으로 금융의 첫 걸음 시작!</h2>
      </div>

      {/* 부제 */}
      <div className="mt-[33px] space-y-[24px] text-center">
        <p className="text-head-05 text-neutral-2 whitespace-pre-line">{"계좌를 만들기만 해도\n수수료 면제"}</p>
      </div>

      {/* 토끼와 코인 이미지 */}
      <div className="flex justify-center">
        <div className="relative h-[312px] w-[312px]">
          <Image
            src="/images/allowance/illust_allowance_makeaccount.png"
            alt="입출금 계좌"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 하단 안내 메시지 */}
      <div className="mt-[42px] mb-[24px] text-center">
        <p className="text-body-01 text-neutral-2">자녀가 보유한 계좌가 없습니다.</p>
      </div>
      <div className="flex flex-col gap-5 items-center mb-[56px]">
        <BigButtonActivated label="개설하기" onClick={onNext}/>
      </div>
    </div>
  )
}
