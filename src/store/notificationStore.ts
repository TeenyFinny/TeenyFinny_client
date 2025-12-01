import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { hasAuthToken } from "@/lib/auth/token";

/**
 * @typedef {Object} NotificationStore
 * @property {string | null} message - 화면 상단 PushNotification에 표시될 메시지.
 * @property {boolean} hasUnread - 읽지 않은 알림 존재 여부.
 * @property {(msg: string | null) => void} setMessage - 메시지를 설정하거나 초기화하는 setter 함수.
 * @property {() => Promise<void>} checkUnread - 읽지 않은 알림 여부를 서버에서 확인하는 함수.
 */
interface NotificationStore {
  message: string | null;
  hasUnread: boolean;
  setMessage: (msg: string | null) => void;
  checkUnread: () => Promise<void>;
}

/**
 * useNotificationStore
 *
 * 전역에서 PushNotification 메시지 및 알림 상태를 관리하기 위한 Zustand 스토어입니다.
 */
export const useNotificationStore = create(
  persist<NotificationStore>(
    (set) => ({
      message: null,
      hasUnread: false,
      setMessage: (msg) => set({ message: msg }),
      checkUnread: async () => {
        // 로그인되지 않은 상태에서는 API 호출하지 않음
        if (!hasAuthToken()) {
          return;
        }
        
        try {
          const res = await api.get(requests.fetchNotice);
          set({ hasUnread: res.data.hasNotice });
        } catch (error) {
          console.error("알림 상태 확인 실패:", error);
        }
      },
    }),
    {
      name: "teenyfinny-notification",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
