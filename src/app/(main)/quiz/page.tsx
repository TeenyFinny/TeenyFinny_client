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

  //  // ✅ state 선언부
  //   const [streakDays, setStreakDays] = useState(0)
  //   const [courseCompleted, setCourseCompleted] = useState(false)
  //   const [quizDate, setQuizDate] = useState(0)
  //   const [monthlyReward, setMonthlyReward] = useState(false)
  //   const [todaySolved, setTodaySolved] = useState(0)
  //   const [quizActive, setQuizActive] = useState(true)

  // ✅ useEffect로 API 요청
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(requests.fetchProgress)
        const data = res.data
        setQuizData(data) // 전역 상태 저장
      } catch (e) {
        const err = e as HttpError

        if (err.statusCode === 403) {
          alert(err.message)
          router.push("/")
        } else {
          console.error(err)
        }
        console.error(e)
      }
    })()
  }, [setQuizData])

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

  const rightBadgeText = quizStore.course_completed ? "랜덤" : `${quizStore.quiz_date}일차`

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
          <StateBadge enabled={true} label={leftBadgeText} onClick={() => { }} />
        </div>

        {/* 우측 배지 */}
        <div className="absolute top-[20px] right-[16px]">
          <StateBadge enabled={false} label={rightBadgeText} onClick={() => { }} />
        </div>

        {/* 상단 설명 텍스트 (course_completed가 false일 때만 표시) */}
        {!quizStore.course_completed && (
          <p className="absolute top-[85px] left-[48px] text-center text-head-04 font-bold text-[var(--color-neutral-1)] w-[231px] mb-8 leading-relaxed">
            15일간의 퀴즈 교육 과정을 전부 마치면<br />
            <span className="text-[var(--color-primary-1)] font-bold">
              주식 크레딧
            </span>
            을 얻을 수 있어요!
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
        <p className="absolute top-[407px] left-[45px] text-center text-head-04 font-bold text-[var(--color-neutral-1)] w-[237px] mb-8 leading-relaxed">
          {quizStore.monthly_reward ? (
            <>
              이번 달의{" "}
              <span className="text-[var(--color-primary-1)] font-bold">
                용돈조르기권
              </span>
              을 <br />이미 받아갔어요!
            </>
          ) : (
            <>
              3일 연속으로 퀴즈를 풀면 한 달에 한 번, <br />
              <span className="text-[var(--color-primary-1)] font-bold">
                용돈조르기권
              </span>
              을 얻을 수 있어요!
            </>
          )}
        </p>
      </div>

      {/* 시작 버튼 */}
      <div className="w-[327px]">
        {quizActive ? (
          <BigButtonActivated
            label="퀴즈 시작하기"
            onClick={() => router.push("/quiz/info")}
          />
        ) : (
          <BigButtonDisabled label={"오늘의 퀴즈를 모두 풀었어요!"} onClick={() => { }} />
        )}
      </div>
    </main>
  )
}
