"use client"

import { RedSmallButtonActivated } from "@/components/custom/quiz/RedSmallButtonActivated"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated"
import { useQuizStore } from "@/store/quizStore"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"


/**
 * QuizQuestionPage
 * - 퀴즈 탭의 문제페이지
 * - 상단 상태바 / 하단 네비게이션은 기본 레이아웃에서 제공
 * - 본 페이지에서는  설명 텍스트, 버튼만 렌더링
 */
export default function Page() {
  const router = useRouter()
  const {
    answer,
    question,
    setQuizData
  } = useQuizStore()

  // 오답 상태
  const [isWrong, setIsWrong] = useState(false)

  /**
   * O / X 클릭 시 실행되는 함수
   */
  const handleAnswerClick = async (selected: "O" | "X") => {
    if (selected === answer) {
      router.push("/quiz/answer")
    } else {
      setIsWrong(true)
      setTimeout(() => setIsWrong(false), 400)
    }
  }


  return (
    <main
      aria-label="퀴즈 문제 페이지"
      className="relative h-[600px] bg-[var(--color-primary-4)] font-[var(--font-sans)] flex flex-col items-center overflow-hidden"
    >
      {/* ===============================
          카드 영역 (중앙 콘텐츠) + 오답 효과
         =============================== */}
      <motion.div
        className="relative w-[327px] h-[238px] mx-auto  bg-[var(--color-neutral-7)] rounded-[16px] shadow-[0_16px_64px_-32px_rgba(0,0,0,0.16)] flex flex-col justify-center items-center mb-[39px] mt-[156px]"
        animate={
          isWrong
            ? {
              x: [-10, 10, -10, 10, 0], // 흔들림
              backgroundColor: [
                "rgb(207 76 76 / 0.2)", // 살짝 붉게
                "rgb(207 76 76 / 0.2)",
                "rgb(207 76 76 / 0.2)",
                "rgb(207 76 76 / 0.2)",
                "rgb(255 255 255 / 1)" // 원래 색 (bg-[var(--color-neutral-7)])
              ],
            }
            : {}
        }
        transition={{ duration: 0.4 }}
      >
        {/* 문제 텍스트 */}
        <p className="text-center text-head-00 font-bold text-[var(--color-neutral-1)] w-[260px] leading-relaxed whitespace-normal break-keep">
          {question}
        </p>
      </motion.div>

      {/* ===============================
          O / X 버튼 영역
         =============================== */}
      <div className="flex gap-[19px]">
        <SmallButtonActivated label="O" onClick={() => handleAnswerClick("O")} />
        <RedSmallButtonActivated label="X" onClick={() => handleAnswerClick("X")} />
      </div>
    </main>
  )
}
