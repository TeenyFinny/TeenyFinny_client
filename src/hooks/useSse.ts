import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { hasAuthToken, loadAuthToken } from "@/lib/auth/token";
import { EventSourcePolyfill } from "event-source-polyfill";

const SSE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/subscribe`;

export const useSse = () => {
  const { setMessage, setHasUnread } = useNotificationStore();

  useEffect(() => {
    // 1. 토큰 확인
    const tokenData = loadAuthToken();
    const token = tokenData?.accessToken;
    if (!token) {
      return;
    }

    // 2. EventSourcePolyfill 생성 (헤더에 토큰 추가)
    const eventSource = new EventSourcePolyfill(SSE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 86400000, // 24시간 (연결 유지 시간)
    });

    // 3. 연결 성공 시
    eventSource.onopen = () => {
      console.log("SSE Connected");
    };

    // 4. 메시지 수신 (이벤트명: "notification")
    eventSource.addEventListener("notification", (e: any) => {
      try {
        const data = JSON.parse(e.data);
        console.log("SSE Notification Received:", data);

        // 알림 스토어 업데이트 (팝업 표시)
        setMessage(data.content); // 또는 data.title + data.content
        setHasUnread(true);
      } catch (err) {
        console.error("SSE Parse Error:", err);
      }
    });

    // 5. 에러 발생 시
    eventSource.onerror = (e: any) => {
      console.error("SSE Error:", e);
      eventSource.close();
      // 재연결 로직은 필요 시 추가 (보통 브라우저/라이브러리가 자동 재연결 시도함)
    };

    // 6. 클린업
    return () => {
      eventSource.close();
      console.log("SSE Disconnected");
    };
  }, [setMessage, setHasUnread]);
};
