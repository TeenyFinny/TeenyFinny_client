"use client"

import React, { useEffect } from "react"
import { StateBadge } from "@/components/ui/badge/StateBadge"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useRouter } from "next/navigation"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { useQuizStore } from "@/store/quizStore"
import { HttpError } from "@/types/axios/httpError.t"
import LoadingScreenSkeletonQuiz from "@/components/ui/LoadingScreenSkeletonQuiz"

/**
 * QuizInfoPage
 * - 퀴즈 탭의 정보페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 제목 텍스트, 설명 텍스트, 다음 버튼만 렌더링
 */

export default function Page() {
    const router = useRouter()
    const {
        setQuizData,
        quizDate,
        streakDays,
        courseCompleted,
        monthlyReward,
        todaySolved,
        title,
        info,
        firstQuizIdToday,
    } = useQuizStore()

    const [loading, setLoading] = React.useState(true);

    // 퀴즈 페이지에서 useEffect 예시
useEffect(() => {
  (async () => {
    try {
      let quizId: number;

      if (!courseCompleted) {
        // 교육과정 문제: quiz_id 계산
        quizId = quizDate * 2 + todaySolved+1;
      } else {
        // 랜덤 문제: 총 30문제 가정
        const TOTAL_QUIZ = 30;
        do {
          quizId = Math.floor(Math.random() * TOTAL_QUIZ) + 1; // 1~30
          console.log(quizId+"번 문제"+firstQuizIdToday);
        } while (todaySolved === 1 && quizId === firstQuizIdToday); 
        // 오늘 두 번째 문제일 때 첫 번째 문제와 겹치지 않게
      }

      // today_solved === 0이면 오늘 첫 문제 ID 저장
      if (todaySolved === 0) {
        const res1 = await api.patch(requests.fetchProgress, { firstQuizIdToday: quizId })
        setQuizData({ firstQuizIdToday: quizId });
      }

      // 퀴즈 정보 API 호출
      const res = await api.get(`${requests.fetchQuiz}?quiz_id=${quizId}`);
      setQuizData(res.data);

    } catch (e) {
      const err = e as HttpError;
      if (err.statusCode === 403) {
        alert(err.message);
        router.push("/");
      } else {
        console.error(err);
      }
    }
    finally {
        setLoading(false); // 로딩 종료
      }
  })();
}, [courseCompleted, todaySolved, firstQuizIdToday, quizDate, setQuizData]);


  // 로딩 중이면 스켈레톤 UI
  if (loading) {
    return <LoadingScreenSkeletonQuiz />;
  }



    // ---------------------------
    // 배지 텍스트
    // ---------------------------
    const leftBadgeText = monthlyReward
        ? "이번 달 도전 완료"
        : `${streakDays+1}일 연속 도전!`

    const rightBadgeText = `${todaySolved + 1} / 2 문제`

    return (
        <main
            aria-label="퀴즈 정보 페이지"
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

                {/* 상단 제목 텍스트 */}
                {(
                    <p className="absolute top-[67px] left-[33px] text-center text-head-00 font-bold text-[var(--color-neutral-1)] w-[260px] mb-8 leading-relaxed">
                        {title}
                    </p>
                )}


                {/* 중단 설명 텍스트 */}
                { (
                    <div className="absolute top-[154px] left-[36px] w-[254px] mb-8">
                        {info.split("\n").map((line, index) => (
                            <p
                                key={index}
                                className="text-left text-body-06 font-bold text-[var(--color-neutral-1)] leading-loose tracking-wide indent-1 mb-1"
                            >
                                {line}
                            </p>
                        ))}
                    </div>
                )}

            </div>

            {/* 시작 버튼 */}
            <div className="w-[327px]">
                { (
                    <BigButtonActivated
                        label="문제 풀기"
                        onClick={() => router.push("/quiz/question")}
                    />
                ) }
            </div>
        </main>
    )
}
