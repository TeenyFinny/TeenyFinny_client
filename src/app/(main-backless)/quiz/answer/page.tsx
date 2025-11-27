"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { StateBadge } from "@/components/ui/badge/StateBadge"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quizStore"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

/**
 * QuizAnswerPage
 * - 퀴즈 탭의 정답페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 중앙 이미지, 설명 텍스트, 버튼만 렌더링
 */
export default function Page() {
  const router = useRouter()
  const user_id = 1
  const {
    setQuizData,
    streak_days,
    course_completed,
    monthly_reward,
    today_solved,
    coupon,
    explanation,
    quiz_date
  } = useQuizStore()

  const STREAK_DAYS_FOR_REWARD = 3 //용돈조르기권을 얻기 위한 연속 문제 풀이 일수
  const EDUCATION_COURSE_LAST_DAY = 15 //교육과정의 마지막 일차

  const quizActive = !course_completed && !monthly_reward && today_solved < 2

  // ---------------------------
  // 배지 텍스트
  // ---------------------------
  const leftBadgeText = monthly_reward
    ? "이번 달 도전 완료"
    : `${streak_days+1}일 연속 도전!`

  const rightBadgeText = `${today_solved + 1} / 2 문제`

  /**
 * today_solved 값을 1 증가시키고 서버에 PATCH 요청으로 업데이트합니다.
 * 또한 전역 상태를 갱신합니다.
 *
 * @param user_id - 현재 사용자 ID
 * @param today_solved - 현재 푼 퀴즈 수
 * @param setQuizData - 상태를 업데이트하는 함수
 * @returns 업데이트된 today_solved 값
 */
  const updateTodaySolved = async (today_solved: number) => {
    const updatedSolved = today_solved + 1
    const res = await api.patch(requests.fetchProgress, { todaySolved: updatedSolved })
    setQuizData({ today_solved: updatedSolved })
    return updatedSolved
  }

  /**
   * 월간 보상 지급 및 쿠폰 수를 서버에 PATCH 요청으로 업데이트하고,
   * 전역 상태를 갱신합니다.
   *
   * @param user_id - 현재 사용자 ID
   * @param coupon - 현재 쿠폰 개수
   * @param setQuizData - 상태를 업데이트하는 함수
   */
  const updateMonthlyReward = async (coupon: number) => {
    await api.patch(requests.fetchProgress, { monthlyReward: true, coupon: coupon + 1 })
    setQuizData({ monthly_reward: true, coupon: coupon + 1 })
  }

  /**
   * 교육과정 완료 상태를 서버에 PATCH 요청으로 업데이트하고,
   * 전역 상태를 갱신합니다.
   *
   * @param user_id - 현재 사용자 ID
   * @param setQuizData - 상태를 업데이트하는 함수
   */
  const updateCourseCompleted = async () => {
    await api.patch(requests.fetchProgress, { courseCompleted: true })
    setQuizData({ course_completed: true })
  }

  /**
 * 퀴즈 완료 처리 함수
 *
 * - today_solved를 1 증가시키고 서버에 PATCH 요청
 * - updatedSolved 값에 따라 페이지 이동 및 보상/교육과정 완료 상태 처리
 * - updatedSolved === 1 → /quiz/info(다음 문제)로 이동
 * - updatedSolved === 2 → 보상 지급, 교육과정 완료 처리, 일반 이동
 * - PATCH 요청 실패 시 콘솔에 에러 로그 출력
 */
  const handleCompleteQuiz = async () => {
    try {
      const updatedSolved = await updateTodaySolved(today_solved)

      if (updatedSolved === 1) {
        router.push("/quiz/info")
      } else if (updatedSolved === 2) {
        // 보상 / 이동 처리 로직
        if (streak_days === STREAK_DAYS_FOR_REWARD && !monthly_reward) {
          if (quiz_date === EDUCATION_COURSE_LAST_DAY && !course_completed) {
            await updateCourseCompleted()
          }
          await updateMonthlyReward(coupon)
          router.push("/quiz/coupon")
        } else if (quiz_date === EDUCATION_COURSE_LAST_DAY && !course_completed) {
          await updateCourseCompleted()
          router.push("/quiz/credit")
        } else {
          router.push("/quiz")
        }
      }
    } catch (err) {
      console.error("진행도 업데이트 실패:", err)
    }
  }


  return (
    <main
      aria-label="퀴즈 정답 페이지"
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
        {today_solved === 0 ? (
          <BigButtonActivated
            label="다음 문제로"
            onClick={handleCompleteQuiz}
          />
        ) : today_solved === 1 ? (
          <BigButtonActivated
            label="오늘의 퀴즈 완료"
            onClick={handleCompleteQuiz}
          />
        ) : null}
      </div>
    </main>
  )
}
