import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { loadAuthToken } from "@/lib/auth/token";
import { EventSourcePolyfill } from "event-source-polyfill";

export const useSse = () => {
  const setMessage = useNotificationStore((state) => state.setMessage);
  const setHasUnread = useNotificationStore(
    (state) => (state as any).setHasUnread
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    // 1. 토큰 확인
    const tokenData = loadAuthToken();
    const token = tokenData?.accessToken;
    if (!token) {
      return;
    }

    // 2. SSE URL 구성 (baseURL에 /channel이 포함되어 있는지 확인)
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const hasChannelInBaseURL = baseURL.includes("/channel");
    const ssePath = hasChannelInBaseURL
      ? "/notifications/subscribe"
      : "/channel/notifications/subscribe";
    const sseUrl = `${baseURL}${ssePath}`;

    // 3. EventSourcePolyfill 생성 (헤더에 토큰 추가)
    const connectSSE = () => {
      // 기존 연결이 있으면 닫기
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSourcePolyfill(sseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 3600000, // 1시간 (연결 유지 시간)
      });

      eventSourceRef.current = eventSource;

      // 연결 성공 시
      eventSource.onopen = () => {
        console.log("SSE Connected:", sseUrl);
        // 재연결 타이머가 있으면 클리어
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      // 메시지 수신 (이벤트명: "notification")
      eventSource.addEventListener("notification", (e: any) => {
        try {
          const data = JSON.parse(e.data);
          console.log("SSE Notification Received:", data);

          // 알림 스토어 업데이트 (팝업 표시)
          // data.content 또는 data.message 또는 data를 확인
          const message = data.content || data.message || data;
          if (message) {
            setMessage(message);
            setHasUnread(true);
          }
        } catch (err) {
          console.error("SSE Parse Error:", err, e.data);
        }
      });

      // 에러 발생 시 재연결 시도
      eventSource.onerror = (e: any) => {
        console.error("SSE Error:", e);
        eventSource.close();

        // 재연결 타이머가 없을 때만 설정 (중복 재연결 방지)
        if (!reconnectTimeoutRef.current) {
          console.log("SSE 재연결 시도 중... (3초 후)");
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectSSE();
          }, 3000);
        }
      };
    };

    // 초기 연결
    connectSSE();

    // 클린업
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        console.log("SSE Disconnected");
      }
    };
  }, [setMessage, setHasUnread]);
};
