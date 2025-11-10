"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { StateBadge } from "@/components/ui/badge/StateBadge"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { useRouter } from "next/navigation"
import { HttpError } from "@/types/axios/httpError.t"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { useQuizStore } from "@/store/quizStore"

/**
 * QuizStartPage
 * - 퀴즈 탭의 시작페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 중앙 이미지, 설명 텍스트, 시작 버튼만 렌더링
 */

export default function Page() {
  const router = useRouter()
  const setQuizData = useQuizStore((state) => state.setQuizData)
  const quizStore = useQuizStore() // 현재 상태 가져오기 (옵션)
  
  // ✅ useEffect로 API 요청
  useEffect(() => {
    (async () => {
      try {
        //const res = await api.get(`${requests.fetchQuiz}?quiz_id=${quizStore.quiz_date}`)
        const res = await api.get(`${requests.fetchQuiz}?quiz_id=2`)
        const data = res.data
        setQuizData(data) // 전역 상태 저장
      } catch (e) {
        console.error(e)
      }
    })()
  }, [setQuizData])

  //TODO: 교육과정일 경우와 랜덤일 경우에 따라 퀴즈 ID를 정하는 알고리즘 추가

  const quizActive =
    !quizStore.course_completed &&
    !quizStore.monthly_reward &&
    quizStore.today_solved < 2
  // ---------------------------
  // 배지 텍스트
  // ---------------------------
  const leftBadgeText = quizStore.monthly_reward
    ? "이번 달 도전 완료"
    : `${quizStore.streak_days}일 연속 도전!`

  const rightBadgeText = `${quizStore.today_solved + 1} / 2 문제`

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

       {/* 상단 제못 텍스트 */}
  {quizActive && (
    <p className="absolute top-[67px] left-[33px] text-center text-head-00 font-bold text-[var(--color-neutral-1)] w-[260px] mb-8 leading-relaxed">
      {quizStore.title}
    </p>
)}


        {/* 중단 설명 텍스트 */}
        {quizActive && (
           <p className="absolute top-[154px] left-[36px] text-left text-body-06 font-regular text-[var(--color-neutral-1)] w-[254px] mb-8 leading-relaxed">
            {quizStore.info}
            </p>
       ) }

      </div>

      {/* 시작 버튼 */}
      <div className="w-[327px]">
        {quizActive ? (
          <BigButtonActivated
            label="문제 풀기"
            onClick={() => router.push("/quiz/question")}
          />
        ) : (
          <BigButtonDisabled label={"오늘의 퀴즈를 모두 풀었어요!"} onClick={() => {}} />
        )}
      </div>
    </main>
  )
}
