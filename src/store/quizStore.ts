// lib/store/quizStore.ts
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface QuizState {
  progress_id: number
  streak_days: number
  course_completed: boolean
  quiz_date: number
  monthly_reward: boolean
  today_solved: number
  title: string
  info: string
  question: string
  answer: string
  explanation: string
  setQuizData: (data: Partial<QuizState>) => void
}

export const useQuizStore = create(
  persist<QuizState>(
    (set) => ({
      progress_id : 0,
      streak_days: 0,
      course_completed: false,
      quiz_date: 0,
      monthly_reward: false,
      today_solved: 0,
      title: "",
      info: "",
      question: "",
      answer: "",
      explanation: "",
      setQuizData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: "teenfinny-user",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
