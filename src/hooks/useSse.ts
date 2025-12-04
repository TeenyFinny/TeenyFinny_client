import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { loadAuthToken } from "@/lib/auth/token";
import { EventSourcePolyfill } from "event-source-polyfill";

const SSE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/channel/notifications/subscribe`;

export const useSse = () => {
  const { setMessage, setHasUnread } = useNotificationStore();

  // 리렌더 또는 중복 호출로 인해 SSE가 여러 번 구독되는 것을 방지
  const subscribed = useRef(false);

  useEffect(() => {
    // 이미 구독했다면 재연결하지 않음
    if (subscribed.current) return;
    subscribed.current = true;

    // 토큰 확인 후 없으면 구독하지 않음
    const tokenData = loadAuthToken();
    const token = tokenData?.accessToken;
    if (!token) return;

    // 헤더가 필요한 경우 EventSource 대신 EventSourcePolyfill 사용
    const eventSource = new EventSourcePolyfill(SSE_URL, {
      headers: { Authorization: `Bearer ${token}` },
      // heartbeatTimeout을 따로 두지 않음 (서버 타임아웃과 중복될 수 있음)
    });

    // 연결 성공 로그
    eventSource.onopen = () => console.log("SSE Connected");

    // 서버에서 보내는 notification 이벤트 수신
    eventSource.addEventListener("notification", (e: any) => {
      try {
        const data = JSON.parse(e.data);
        setMessage(data.content);
        setHasUnread(true);
      } catch (err) {
        console.error("SSE Parse Error:", err);
      }
    });

    // 에러 발생 시 커넥션 종료
    eventSource.onerror = () => {
      console.error("SSE Error → connection closed.");
      eventSource.close();
    };

    // cleanup: 컴포넌트 unmount 시 반드시 close()
    // 이것 없으면 FIN_WAIT_2 대량 발생
    return () => {
      eventSource.close();
      console.log("SSE Disconnected");
    };
  }, [setMessage, setHasUnread]);
};
