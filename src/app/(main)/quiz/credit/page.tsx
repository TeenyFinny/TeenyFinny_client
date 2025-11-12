"use client"

import Image from "next/image"
import React, { useEffect } from "react"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quizStore"

/**
 * QuizCreditPage
 * - 퀴즈 탭의 주식크레딧 페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 중앙 이미지, 설명 텍스트, 버튼만 렌더링
 */
export default function Page() {
  const router = useRouter()
  const { course_completed, request_completed } = useQuizStore()

  useEffect(() => {
    if (!course_completed) {
      alert("주식 크레딧이 없습니다. 퀴즈를 먼저 풀어주세요.")
      router.replace("/quiz")
    }
  }, [course_completed, router])

  return (
    <main
      aria-label="주식 크레딧 페이지"
      className="h-[600px] bg-[var(--color-primary-4)] font-[var(--font-sans)] flex flex-col items-center overflow-hidden"
    >
      {/* ===============================
          카드 영역 (중앙 콘텐츠)
         =============================== */}
      <div className="relative w-[327px] h-[490px] mx-auto bg-[var(--color-neutral-7)] rounded-[16px] shadow-[0_16px_64px_-32px_rgba(0,0,0,0.16)] flex flex-col items-center pt-[160px] pb-[80px] mb-[32px]">

        {/* 상단 제목 텍스트 */}
        <p className="absolute top-[47px] left-[36px] text-center text-head-00 font-bold text-[var(--color-neutral-1)] w-[260px] mb-8 leading-relaxed">
          {"주식 크레딧을 받았어요!"}
        </p>

        {/* 중앙 이미지 */}
        <div className="absolute top-[95px] w-[215px] h-[322px]">
          <Image
            src="/images/quiz/illust_quiz_3.png"
            alt="주식 크레딧 획득을 축하하는 일러스트"
            width={215}
            height={322}
            priority
          />
        </div>

        {/* 하단 설명 텍스트 */}
        <p className="absolute top-[427px] text-center text-body-04 font-medium text-[var(--color-neutral-1)] w-[286px] mb-8 leading-relaxed">
          {"크레딧을 사용하기 위해서 투자 계좌가 필요해요."}
        </p>
      </div>

      {/* 계좌 생성 버튼 */}
      <div className="w-[327px]">
        {request_completed ? (
          <BigButtonDisabled label="계좌 생성 요청 완료" onClick={() => { }} />
        ) : (
          <BigButtonActivated label="계좌 생성하기" onClick={()=> {router.push("/quiz/credit/request")}} />
        )}
      </div>
    </main>
  )
}
