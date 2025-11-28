"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { StateBadge } from "@/components/ui/badge/StateBadge"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quizStore"

/**
 * QuizCouponPage
 * - 퀴즈 탭의 용돈조르기권 획득페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 중앙 이미지, 설명 텍스트, 확인 버튼만 렌더링
 */
export default function Page() {
  const router = useRouter()
  const {
    setQuizData,
    courseCompleted,
    quizDate,
    requestCompleted,
  } = useQuizStore()


  /**
 * 확인 버튼 클릭 시 실행되는 함수
 *
 * - 교육과정이 완료되고(`course_completed`), 아직 요청을 완료하지 않은 상태(`request_completed === false`)라면
 *   주식 크레딧 페이지(`/quiz/credit`)로 이동합니다.
 * - 그 외 경우에는 일반 퀴즈 페이지(`/quiz`)로 이동합니다.
 */
  const handleConfirmClick = () => {
    if (courseCompleted && !requestCompleted) {
      router.push("/quiz/credit");
    } else {
      router.push("/quiz");
    }
  };

  // ---------------------------
  // 배지 텍스트
  // ---------------------------
  const leftBadgeText = "이번 달 도전 완료"

  const rightBadgeText = courseCompleted ? "랜덤" : `${quizDate}일차`

  return (
    <main
      aria-label="용돈조르기권 획득 페이지"
      className="relative w-full max-w-[375px] mx-auto h-full max-h-[800px] bg-primary-4 font-[var(--font-sans)] flex flex-col items-center overflow-hidden"
    >
      {/* ===============================
          카드 영역 (중앙 콘텐츠)
         =============================== */}
      <div className="relative w-[327px] h-[490px] mx-auto bg-neutral-7 rounded-[16px] shadow-[0_16px_64px_-32px_rgba(0,0,0,0.16)] flex flex-col items-center pt-[160px] pb-[80px] mb-[32px]">
        {/* 좌측 배지 */}
        <div className="absolute top-[20px] left-[16px]">
          <StateBadge enabled={true} label={leftBadgeText} onClick={() => { }} />
        </div>

        {/* 우측 배지 */}
        <div className="absolute top-[20px] right-[16px]">
          <StateBadge enabled={false} label={rightBadgeText} onClick={() => { }} />
        </div>

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
        <p className="absolute top-[407px] left-[45px] text-center text-head-04 font-bold text-neutral-1 w-[237px] mb-8 leading-relaxed">
          <>용돈조르기권 획득!
          </>
        </p>
      </div>

      {/* 확인 버튼 */}
      <div className="w-[327px]">
        <BigButtonActivated
          label="확인"
          onClick={handleConfirmClick}
        />
      </div>
    </main>
  )
}
