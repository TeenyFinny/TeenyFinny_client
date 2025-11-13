"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 사용자 전역 상태 타입 정의
 *
 * @typedef UserState
 * @property {string} userName - 사용자 표시 이름
 * @property {number | null} userId - 사용자 ID
 * @property {"parent" | "child"} userType - 사용자 유형
 *   - parent : 부모 사용자
 *   - child  : 자녀 사용자
 *   - admin  : 관리자 계정
 *   - null   : 로그인 전 상태 (로그인 기능 연동 전)
 * @property {boolean} hasChildren - 부모 계정일 경우 자녀 연결 여부
 * @property {(userName: string, userType: "parent" | "child" | null, userId?: number, hasChildren?: boolean) => void} setUser - 사용자 정보를 설정합니다.
 * @property {(value: boolean) => void} setHasChildren - 부모의 자녀 연결 여부만 개별적으로 수정합니다.
 * @property {() => void} clearUser - 사용자 정보를 초기화(로그아웃)합니다.
 */
interface UserState {
  userName: string;
  userId: number | null;
  userType: "parent" | "child" | null;
  hasChildren: boolean;
  setUser: (
    userName: string,
    userType: "parent" | "child" | null,
    userId?: number,
    hasChildren?: boolean
  ) => void;
  setHasChildren: (value: boolean) => void;
  clearUser: () => void;
}

/**
 * 👤 전역 사용자 Store (Zustand + persist)
 *
 * - 로컬스토리지 key: `teenfinny-user`
 * - 새로고침 후에도 상태가 유지됩니다.
 * - 로그인 로직 연동 시 쿠키/토큰 기반으로 수정 예정.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      /** 사용자명 */
      userName: "",
      /** 사용자 ID */
      userId: null,
      /** 사용자 유형 (부모/자녀/관리자/로그인 전) */
      userType: null,
      /** 부모 계정의 자녀 연결 여부 */
      hasChildren: false,

      /**
       * 사용자 정보를 통합 설정합니다.
       * @param {string} userName - 사용자 이름
       * @param {"parent" | "child" | null} userType - 사용자 유형
       * @param {number} [userId] - 사용자 ID (optional)
       * @param {boolean} [hasChildren=false] - 부모의 자녀 연결 여부 (optional)
       */
      setUser: (userName, userType, userId, hasChildren = false) =>
        set({ userName, userType, userId: userId ?? null, hasChildren }),

      /**
       * 부모 계정의 자녀 연결 여부를 개별적으로 변경합니다.
       * (자녀 추가/삭제 시 사용)
       * @param {boolean} value - 연결 여부
       */
      setHasChildren: (value) => set({ hasChildren: value }),

      /**
       * 사용자 정보를 초기 상태로 되돌립니다.
       * (로그아웃 시 호출)
       */
      clearUser: () =>
        set({ userName: "", userId: null, userType: null, hasChildren: false }),
    }),
    {
      name: "teenfinny-user", // ✅ 로컬스토리지 key
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // 필요한 경우 특정 필드만 저장하려면 partialize 옵션 사용
      // partialize: (state) => ({ userName: state.userName, userType: state.userType, hasChildren: state.hasChildren }),
      // 마이그레이션이 필요한 경우:
      // migrate: (persisted, fromVersion) => persisted,
    }
  )
);
