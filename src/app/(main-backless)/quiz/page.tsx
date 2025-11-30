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
import LoadingScreenSkeletonQuiz from "@/components/ui/LoadingScreenSkeletonQuiz"

/**
 * QuizStartPage
 * - 퀴즈 탭의 시작페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는 배지, 중앙 이미지, 설명 텍스트, 시작 버튼만 렌더링
 */
export default function Page() {
  const router = useRouter()
  const {
    setQuizData,
    streakDays,        //연속 풀이 일수
    courseCompleted,   //교육과정 완료 여부
    monthlyReward,     //용돈조르기권 획즉 여부
    todaySolved,       //오늘 푼 문제 수
    quizDate,          //교육과정진행일자
    progressId,        //퀴즈 진행도 id
  } = useQuizStore()
  const [loading, setLoading] = React.useState(true);

  // ✅ useEffect로 API 요청
  useEffect(() => {
    let isMounted = true; // 언마운트 여부 플래그

    (async () => {
      try {
        // 1) 기존 progress 불러오기
        const res = await api.get(requests.fetchProgress);
        const data = res.data;

        if (res && isMounted) {
          setQuizData(data);
          return;
        }

      } catch (e) {
        const err = e as HttpError;

        // 404 → progress 없음 → 생성
        if (err.statusCode === 404) {
          const created = await api.post(requests.fetchProgress);
          if (isMounted) setQuizData(created.data.data);
          return;
        }

        // 권한 문제
        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
          return;
        }

        // 기타 오류
        console.error(err);
      } finally {
        if (isMounted) setLoading(false); // 언마운트 여부 확인 후 로딩 종료
      }
    })();

    return () => {
      isMounted = false; // cleanup에서 언마운트 표시
    };
  }, [progressId, setQuizData, router]);

  // 로딩 중이면 스켈레톤 UI
  if (loading) {
    return <LoadingScreenSkeletonQuiz />;
  }
  //퀴즈 가능 여부 확인
  const quizActive = (!courseCompleted || !monthlyReward) && todaySolved < 2;

  return (
    <main
      aria-label="퀴즈 시작 페이지"
      className="relative w-full max-w-[375px] mx-auto h-full max-h-[800px] bg-primary-4 font-sans flex flex-col items-center overflow-hidden"
    >
      {/* ===============================
    카드 영역 (중앙 콘텐츠 - 출석 스탬프)
   =============================== */}
      <div className="relative w-[327px] mx-auto bg-neutral-7 rounded-[16px] shadow-[0_16px_64px_-32px_rgba(0,0,0,0.16)] flex flex-col items-center justify-center pt-[40px] pb-[51px] mb-[32px]">
        <p className="text-center text-primary-1 text-head-02 font-bold text-neutral-1 w-[231px] mt-5 mb-13">
          퀴즈 {streakDays + 1}일차 도전 중!
        </p>

        <div className="flex flex-col gap-4 justify-center items-center">
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const stampIndex = rowIndex * 5 + colIndex
                const isStamped = stampIndex < streakDays

                return (
                  <div key={colIndex} className="relative">
                    {/* 날짜 숫자 */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-neutral-1">
                      {stampIndex + 1}
                    </div>
                    {/* 도장 박스 */}
                    <div
                      className={`w-[48px] h-[48px] rounded-[8px] flex items-center justify-center border-2 transition-all ${isStamped
                        ? 'bg-white border-primary-1 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                        : 'bg-white border-neutral-5'
                        }`}
                    >
                      {isStamped ? (
                        <div className="relative w-full h-full">
                          <Image
                            src="/images/saving/illust_saving_2.png"
                            alt={`도장 ${stampIndex + 1}`}
                            fill
                            className="object-cover rounded-[6px]"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src="/images/saving/illust_saving_2.png"
                            alt={`도장 ${stampIndex + 1}`}
                            fill
                            className="object-cover rounded-[6px] grayscale"
                          />
                        </div>
                      )}

                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <p className="whitespace-normal break-words text-center text-body-02 text-neutral-1 w-[270px] mt-16 mb-6">
          15일간의 퀴즈를 모두 풀면{" "}
          <span className="text-primary-1 text-body-01 font-bold">주식 크레딧</span>
          을<br /> 받고 투자 계좌를 만들 수 있어요!
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
