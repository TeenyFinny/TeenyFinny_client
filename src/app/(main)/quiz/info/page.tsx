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
    courseCompleted,
    todaySolved,
    title,
    info,
    firstQuizIdToday,
  } = useQuizStore()

  const [loading, setLoading] = React.useState(true);

  // 퀴즈 페이지에서 useEffect 예시
  useEffect(() => {
    let isMounted = true; // 언마운트 여부 플래그

    (async () => {
      try {
        let quizId: number;

        if (!courseCompleted) {
          // 교육과정 문제: quiz_id 계산
          quizId = quizDate * 2 + todaySolved + 1;
        } else {
          // 랜덤 문제: 총 30문제 가정
          const TOTAL_QUIZ = 30;
          do {
            quizId = Math.floor(Math.random() * TOTAL_QUIZ) + 1; // 1~30
          } while (todaySolved === 1 && quizId === firstQuizIdToday);
        }

        // today_solved === 0이면 오늘 첫 문제 ID 저장
        if (todaySolved === 0) {
          const res1 = await api.patch(requests.fetchProgress, { firstQuizIdToday: quizId });
          if (isMounted) setQuizData({ firstQuizIdToday: quizId });
        }

        // 퀴즈 정보 API 호출
        const res = await api.get(`${requests.fetchQuiz}?quiz_id=${quizId}`);
        if (isMounted) setQuizData(res.data);

      } catch (e) {
        const err = e as HttpError;
        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false); // 언마운트 여부 확인 후 로딩 종료
      }
    })();

    return () => {
      isMounted = false; // cleanup에서 언마운트 표시
    };
  }, [courseCompleted, todaySolved, firstQuizIdToday, quizDate, setQuizData, router]);

  // 로딩 중이면 스켈레톤 UI
  if (loading) {
    return <LoadingScreenSkeletonQuiz />;
  }


  // ---------------------------
  // 배지 텍스트
  // ---------------------------
  const leftBadgeText = `${quizDate + 1}일차 도전!`

  const rightBadgeText = `${todaySolved + 1} / 2 문제`

  // **...** 패턴을 찾아 특정 스타일의 <span> 태그로 변환하는 함수
  const renderWithHighlights = (line) => {
    // 1. ** 와 ** 사이의 모든 문자열을 찾고, <span> 태그로 감싸줍니다.
    const htmlString = line.replace(
      /\*\*(.*?)\*\*/g, // 정규표현식: **(키워드)** 패턴
      // 키워드에 적용할 강조 스타일: 굵게(font-extrabold) + 눈에 띄는 색상(예: text-yellow-500)
      '<span class="font-extrabold text-primary-2">$1</span>'
    );
    // 2. HTML 문자열을 렌더링하기 위해 dangerouslySetInnerHTML 사용
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <main
      aria-label="퀴즈 정보 페이지"
      className="relative w-full max-w-[375px] mx-auto h-full max-h-[800px] bg-primary-4 font-sans flex flex-col items-center overflow-hidden"
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

        {/* 상단 제목 텍스트 */}
        {/* {(
          <p className="absolute top-[67px] left-[33px] text-center text-head-00 font-bold text-primary-1 w-[260px] mb-8 leading-relaxed">
            {title}
          </p>
        )} */}




        {/* 중단 설명 텍스트 */}
        {(
          <div className="absolute top-[64px] left-[36px] w-[254px] mb-8">
            {info.split("\n").map((line, index) => {
              // 빈 문자열이 있다면 렌더링하지 않고 넘어갑니다.
              if (line.trim() === '') {
                return null;
              }

              // 라인이 '•' 기호로 시작하는지 확인합니다.
              const isBody = line.trim().startsWith('•');

              // 텍스트에서 '•' 기호를 제거합니다.
              const content = line.trim().replace(/^•\s*/, '');
              // '^•\s*'는 줄 시작 부분의 '•'와 그 뒤의 공백(있을 경우)을 제거합니다.

              return (
                <p
                  key={index}
                  className={`
                        text-left leading-snug tracking-wide break-all whitespace-normal
                        ${!isBody
                      // ✅ 짝수 Index (제목): 큰 글씨, 두꺼운 볼드, 위 여백 추가
                      ? 'text-head-01 font-extrabold text-primary-1 mt-6'
                      // ✅ 홀수 Index (설명): 일반 크기, 일반 볼드, 들여쓰기
                      : 'text-head-03 font-bold text-neutral-1 indent-2'
                    }
                        mb-3 // 각 라인 아래 여백
                    `}
                >
                  {/* 라인의 내용만 렌더링 */}
                  {renderWithHighlights(content)}
                </p>
              );
            })}
            {/* 주식 관련 이미지 삽입 위치 */}
            <div className="absolute top-[265px] w-full flex justify-center">
              <img
                src="/images/quiz/image_quiz_1.jpg" // ✅ 이미지 경로 설정 (public 폴더 기준)
                alt="어린이를 위한 주식 투자 설명 일러스트"
                className="w-40 h-40 object-contain" // ✅ 이미지 크기 및 스타일 조정
              />
            </div>
          </div>
        )}

      </div>

      {/* 시작 버튼 */}
      <div className="w-[327px]">
        {(
          <BigButtonActivated
            label="문제 풀기"
            onClick={() => router.push("/quiz/question")}
          />
        )}
      </div>
    </main>
  )
}
