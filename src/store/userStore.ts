"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

/**
 * 사용자 상태 타입
 *
 * @typedef UserState
 * @property {string} userName - 사용자 표시 이름
 * @property {string | null} token - 인증 토큰 (로그인 시 설정)
 * @property {"parent" | "child"} userType - 사용자 유형
 * @property {(userName: string, token: string, userType: "parent" | "child" | "admin" | null) => void} setUser - 사용자 정보를 설정합니다.
 * @property {() => void} clearUser - 사용자 정보를 초기화(로그아웃)합니다.
 */
interface UserState {
  userName: string
  token: string | null
  userType: "parent" | "child" | "admin" | null
  setUser: (userName: string, token: string, userType: "parent" | "child" | "admin" | null) => void
  clearUser: () => void
}

/**
 * 전역 사용자 Store (영속 저장)
 *
 * - 로컬스토리지 key: `teenfinny-user`
 * - 페이지 전환/새로고침 후에도 상태를 복원합니다.
 * - 필요 시 `sessionStorage`로 바꾸려면 `createJSONStorage(() => sessionStorage)` 사용.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: "",
      token: null,
      userType: null,

      /**
       * 사용자 정보를 설정합니다.
       * @param {string} userName - 사용자 이름
       * @param {string} token - 인증 토큰
       * @param {"parent" | "child"} userType - 사용자 유형
       */
      setUser: (userName, token, userType) => set({ userName, token, userType }),

      /**
       * 사용자 정보를 기본값으로 초기화합니다. (로그아웃 용도)
       */
      clearUser: () => set({ userName: "", token: null, userType: "parent" }),
    }),
    {
      name: "teenfinny-user", // 로컬스토리지 키
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // 특정 필드만 저장하고 싶다면 partialize 사용 예:
      // partialize: (state) => ({ userName: state.userName, userType: state.userType }),
      // 마이그레이션 필요 시:
      // migrate: (persisted, fromVersion) => persisted,
    }
  )
)
