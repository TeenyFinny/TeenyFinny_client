// lib/store/quizStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface QuizState {
  progressId: number;
  streakDays: number;
  courseCompleted: boolean;
  quizDate: number;
  monthlyReward: boolean;
  todaySolved: number;
  coupon: number;
  title: string;
  info: string;
  question: string;
  answer: string;
  explanation: string;
  requestCompleted: boolean;
  firstQuizIdToday?: number; // 오늘 첫 문제 ID
  setQuizData: (data: Partial<QuizState>) => void;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set) => ({
      progressId: 0,
      streakDays: 0,
      courseCompleted: false,
      quizDate: 0,
      monthlyReward: false,
      todaySolved: 0,
      title: "",
      coupon: 0,
      info: "",
      question: "",
      answer: "",
      explanation: "",
      requestCompleted: false,
      firstQuizIdToday: 0,
      setQuizData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: "teenyfinny-quiz",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
