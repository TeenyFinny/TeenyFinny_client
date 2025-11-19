// lib/store/quizStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface QuizState {
  progress_id: number;
  streak_days: number;
  course_completed: boolean;
  quiz_date: number;
  monthly_reward: boolean;
  today_solved: number;
  coupon: number;
  title: string;
  info: string;
  question: string;
  answer: string;
  explanation: string;
  request_completed: boolean;
  first_quiz_id_today?: number; // 오늘 첫 문제 ID
  setQuizData: (data: Partial<QuizState>) => void;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set) => ({
      progress_id: 0,
      streak_days: 0,
      course_completed: false,
      quiz_date: 0,
      monthly_reward: false,
      today_solved: 0,
      title: "",
      coupon: 0,
      info: "",
      question: "",
      answer: "",
      explanation: "",
      request_completed: false,
      first_quiz_id_today: 0,
      setQuizData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: "teenyfinny-quiz",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
