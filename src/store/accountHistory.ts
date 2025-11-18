// lib/store/accountHistory.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AccountHistoryState {
  childId: number | null;
  childName: string;
  accountType: string;     // allowance | invest | saving
  accountName: string;     // "용돈 계좌" 등 UI용 이름
  balance: number;

  year: number;
  month: number;

  setHistoryData: (data: Partial<AccountHistoryState>) => void;
}

export const useAccountHistoryStore = create(
  persist<AccountHistoryState>(
    (set) => ({
      childId: null,
      childName: "",
      accountType: "",
      accountName: "",
      balance: 0,

      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,

      /** 부분 업데이트 가능 (QuizStore와 동일) */
      setHistoryData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: "teenfinny-account-history",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
