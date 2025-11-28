"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface SelectedChildState {
  selectedChildId: number | null;
  selectedChildName: string;
  accountType: string;   // allowance | invest | saving
  accountName: string;   // "용돈 계좌" 등 UI용 이름
  balance: string;
  year: number;
  month: number;
  hasInvestAccount: boolean; // 투자 계좌 존재 여부 추가
  /** 자녀 선택 시 기본 정보 저장 */
  setChildBaseInfo: (id: number, name: string) => void;
  /** 계좌 상세 페이지 이동 시 추가 정보 저장 */
  setHistoryData: (data: Partial<SelectedChildState>) => void;
  /** 투자 계좌 존재 여부 저장 */
  setInvestAccountExists: (exists: boolean) => void;
}
export const useSelectedChildStore = create(
  persist<SelectedChildState>(
    (set) => ({
      selectedChildId: null,
      selectedChildName: "",
      accountType: "",
      accountName: "",
      balance: "0",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      hasInvestAccount: false, // 기본값: 투자 계좌 없음
      /** 자녀 선택 시 기본 정보 저장 */
      setChildBaseInfo: (id, name) =>
        set({
          selectedChildId: id,
          selectedChildName: name,
        }),
      /** 계좌 상세 페이지 이동 시 추가 정보 저장 */
      setHistoryData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
        /** 투자 계좌 존재 여부 저장 */
      setInvestAccountExists: (exists) =>
        set({
          hasInvestAccount: exists,
        }),
    }),
    {
      name: "teenfinny-selected-child",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);