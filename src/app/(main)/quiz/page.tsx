"use client"

import Image from "next/image"
import React from "react"
import { StateBadge } from "@/components/ui/badge/StateBadge"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { useRouter } from "next/navigation"

/**
 * QuizStartPage
 * - 퀴즈 탭의 시작페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 중앙 이미지, 설명 텍스트, 시작 버튼만 렌더링
 */

export default function Page() {
  const router = useRouter()

  // ---------------------------
  // 샘플 데이터 (추후 실제 데이터로 대체)
  // ---------------------------
  const streak_days = 2
  const course_completed = false
  const quiz_date = 10
  const monthly_reward = false
  const today_solved = 1

// ---------------------------
// 상태 로직
// ---------------------------
// 기본 로직: today_solved가 0 또는 1이면 true, 2면 false
let quiz_active = today_solved < 2

// course_completed와 monthly_reward가 모두 true면 무조건 false
if (course_completed && monthly_reward) {
  quiz_active = false
}
  // ---------------------------
  // 배지 텍스트
  // ---------------------------
  const leftBadgeText = monthly_reward
    ? "이번 달 도전 완료"
    : `${streak_days}일 연속 도전!`

  const rightBadgeText = course_completed ? "랜덤" : `${quiz_date}일차`

  // ---------------------------
  // 설명 텍스트
  // ---------------------------
  const topText = !course_completed
    ? "15일간의 퀴즈 교육 과정을 전부 마치면\n주식 크레딧을 얻을 수 있어요!"
    : null

  const bottomText = monthly_reward
    ? "이번 달의 용돈조르기권을\n 이미 받아갔어요!"
    : "3일 연속으로 퀴즈를 풀면 한 달에 한 번,\n용돈조르기권을 얻을 수 있어요!"

  return (
    <main
      aria-label="퀴즈 시작 페이지"
      className="relative w-full max-w-[375px] mx-auto h-full max-h-[800px] bg-[var(--color-primary-4)] font-[var(--font-sans)] flex flex-col items-center overflow-hidden"
    >
      {/* ===============================
          카드 영역 (중앙 콘텐츠)
         =============================== */}
      <div className="relative w-[327px] h-[490px] mx-auto bg-[var(--color-neutral-7)] rounded-[16px] shadow-[0_16px_64px_-32px_rgba(0,0,0,0.16)] flex flex-col items-center pt-[160px] pb-[80px] mb-[32px]">
        {/* 좌측 배지 */}
        <div className="absolute top-[20px] left-[16px]">
          <StateBadge enabled={true} label={leftBadgeText} onClick={() => {}} />
        </div>

        {/* 우측 배지 */}
        <div className="absolute top-[20px] right-[16px]">
          <StateBadge enabled={false} label={rightBadgeText} onClick={() => {}} />
        </div>

        {/* 상단 설명 텍스트 (course_completed가 false일 때만 표시) */}
        {topText && (
          <p className="absolute top-[85px] left-[48px] text-center text-head-04 font-bold text-[var(--color-neutral-1)] w-[231px] mb-8 whitespace-pre-line">
            {topText}
          </p>
        )}

        {/* 중앙 이미지 */}
        <div className="absolute top-[135px] w-[262px] h-[262px] mb-8">
          <Image
            src="/images/quiz/illust_quiz_credit.png"
            alt="퀴즈 일러스트"
            width={262}
            height={262}
            priority
          />
        </div>

        {/* 하단 설명 텍스트 */}
        <p className="absolute top-[407px] left-[45px] text-center text-head-04 font-bold text-[var(--color-neutral-1)] w-[237px] mb-8 whitespace-pre-line">
          {bottomText}
        </p>
      </div>

      {/* 시작 버튼 */}
      <div className="w-[327px]">
        {quiz_active ? (
          <BigButtonActivated
            label="퀴즈 시작하기"
            onClick={() => router.push("/quiz/info")}
          />
        ) : (
          <BigButtonDisabled label={"오늘의 퀴즈를 모두 풀었어요!"} onClick={() => {}} />
        )}
      </div>
    </main>
  )
}
