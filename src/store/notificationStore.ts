import { create } from "zustand";

/**
 * @typedef {Object} NotificationStore
 * @property {string | null} message - 화면 상단 PushNotification에 표시될 메시지.
 * @property {(msg: string | null) => void} setMessage - 메시지를 설정하거나 초기화하는 setter 함수.
 */
interface NotificationStore {
    message: string | null;
    setMessage: (msg: string | null) => void;
}

/**
 * useNotificationStore
 *
 * 전역에서 PushNotification 메시지를 관리하기 위한 Zustand 스토어입니다.
 *
 * ### 역할
 * - 페이지 간 이동 시에도 메시지를 유지합니다.
 * - 성공/실패 메시지를 중앙 집중식으로 관리합니다.
 * - profile 진입 시 PushNotification을 자연스럽게 표시할 수 있습니다.
 *
 * ### 예시
 * ```tsx
 * const { setMessage } = useNotificationStore();
 * 
 * const onSuccess = () => {
 *   setMessage("비밀번호 변경에 성공하였습니다.");
 *   router.push("/profile");
 * };
 * ```
 *
 * @returns {NotificationStore} PushNotification 전역 상태와 setter 함수
 */
export const useNotificationStore = create<NotificationStore>((set) => ({
    message: null,
    setMessage: (msg) => set({ message: msg }),
}));
