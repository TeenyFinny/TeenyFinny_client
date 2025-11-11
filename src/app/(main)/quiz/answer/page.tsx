"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { StateBadge } from "@/components/ui/badge/StateBadge"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quizStore"

/**
 * QuizAnswerPage
 * - 퀴즈 탭의 정답페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 중앙 이미지, 설명 텍스트, 버튼만 렌더링
 */
export default function Page() {
  const router = useRouter()
  const {
    setQuizData,
    streak_days,
    course_completed,
    monthly_reward,
    today_solved,
    credit,
    explanation
  } = useQuizStore()

  const quizActive = !course_completed && !monthly_reward && today_solved < 2

  // ---------------------------
  // 배지 텍스트
  // ---------------------------
  const leftBadgeText = monthly_reward
    ? "이번 달 도전 완료"
    : `${streak_days}일 연속 도전!`

  const rightBadgeText = `${today_solved} / 2 문제`

  return (
    <main
      aria-label="퀴즈 시작 페이지"
      className="h-[600px] bg-[var(--color-primary-4)] font-[var(--font-sans)] flex flex-col items-center overflow-hidden"
    >
      {/* ===============================
          카드 영역 (중앙 콘텐츠)
         =============================== */}
      <div className="relative w-[327px] h-[490px] mx-auto bg-[var(--color-neutral-7)] rounded-[16px] shadow-[0_16px_64px_-32px_rgba(0,0,0,0.16)] flex flex-col items-center pt-[160px] pb-[80px] mb-[32px]">
        {/* 좌측 배지 */}
        <div className="absolute top-[20px] left-[16px]">
          <StateBadge enabled={true} label={leftBadgeText} onClick={() => { }} />
        </div>

        {/* 우측 배지 */}
        <div className="absolute top-[20px] right-[16px]">
          <StateBadge enabled={false} label={rightBadgeText} onClick={() => { }} />
        </div>

        {/* 상단 제목 텍스트 */}
        {quizActive && (
          <p className="absolute top-[67px] left-[33px] text-center text-head-00 font-bold text-[var(--color-neutral-1)] w-[260px] mb-8 leading-relaxed">
            {"정답이에요!"}
          </p>
        )}

        {/* 중앙 이미지 */}
        <div className="absolute top-[135px] w-[214px] h-[214px] mb-8">
          <Image
            src="/images/quiz/illust_quiz_1.png"
            alt="퀴즈 일러스트"
            width={214}
            height={214}
            priority
          />
        </div>

        {/* 하단 설명 텍스트 */}
        <p className="absolute top-[407px] left-[45px] text-center text-head-04 font-bold text-[var(--color-neutral-1)] w-[237px] mb-8 leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* 시작 버튼 */}
      <div className="w-[327px]">
        {today_solved === 1 ? (
          <BigButtonActivated
            label="다음 문제로"
            onClick={() => router.push("/quiz/info")}
          />
        ) : today_solved === 2 ? (
          <BigButtonActivated
            label="오늘의 퀴즈 완료"
            onClick={() => {
              if (streak_days === 3 && !monthly_reward) {
                 setQuizData({ monthly_reward: true, credit: credit + 1 })
                router.push("/quiz/credit")
              } else {
                router.push("/quiz")
              }
            }}
          />
        ) : null}
      </div>
    </main>
  )
}
