import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { loadAuthToken } from "@/lib/auth/token";
import { EventSourcePolyfill } from "event-source-polyfill";

// SSE 엔드포인트 URL 설정
const SSE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/channel/notifications/subscribe`;

/**
 * Server-Sent Events (SSE) 연결을 설정하고 관리하는 커스텀 React Hook입니다.
 * * 컴포넌트 마운트 시 SSE 연결을 시작하고,
 * 알림 메시지를 수신하여 전역 상태(Zustand)에 저장합니다.
 * 컴포넌트 언마운트 시 연결을 정리합니다.
 */
export const useSse = () => {
  // 알림 상태 관리를 위한 Zustand 스토어 훅 사용
  const { setMessage, setHasUnread } = useNotificationStore();

  // 리렌더링 시 SSE 연결이 중복으로 생성되는 것을 방지하기 위한 레퍼런스
  const subscribed = useRef(false);

  useEffect(() => {
    // 이미 구독이 진행 중이라면 새 연결을 만들지 않고 종료
    if (subscribed.current) return;
    subscribed.current = true; // 구독 시작 플래그 설정

    // 인증 토큰 로드 (없으면 연결하지 않음)
    const tokenData = loadAuthToken();
    const token = tokenData?.accessToken;
    if (!token) {
      subscribed.current = false; // 토큰이 없어 실패했으므로 플래그 초기화
      return;
    }

    // JWT 토큰을 Authorization 헤더에 담기 위해 EventSourcePolyfill 사용
    const eventSource = new EventSourcePolyfill(SSE_URL, {
      headers: { Authorization: `Bearer ${token}` },
      // 자동 재연결 시 보낼 추가 옵션이 필요할 경우 여기에 설정 가능
    });

    // 연결 성공 시 로그 출력
    eventSource.onopen = () => console.log("SSE Connected");

    /**
     * 1) 기본 message 이벤트 (서버가 event: 필드를 지정하지 않은 경우)
     */
    eventSource.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data as string);
        if (!data?.content) return;

        // 알림 상태 업데이트
        setMessage(data.content);
        setHasUnread(true);
      } catch (err) {
        console.error("SSE Parse Error (message):", err);
      }
    };

    /**
     * 2) 커스텀 'notification' 이벤트 (서버가 event: notification 을 쓰는 경우)
     */
    eventSource.addEventListener("notification", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data as string);
        if (!data?.content) return;

        // 알림 상태 업데이트
        setMessage(data.content);
        setHasUnread(true);
      } catch (err) {
        console.error("SSE Parse Error (notification):", err);
      }
    });

    /**
     * 에러 발생 시 핸들러
     * EventSourcePolyfill은 기본적으로 자동 재연결을 시도합니다.
     * 명시적으로 close()를 호출하면 재연결 메커니즘이 중단됩니다.
     */
    eventSource.onerror = (e: any) => {
      console.error("SSE Error detected.", e);
      // 인증 오류(401) 등 치명적인 오류 발생 시에만 close() 처리 가능
      if (e && e.status === 401) {
        console.log("인증 오류(401)로 인해 SSE 연결이 종료되었습니다.");
        eventSource.close();
      }
    };

    // cleanup: 컴포넌트 unmount 시 연결 해제
    return () => {
      eventSource.close(); // 연결 종료
      subscribed.current = false; // 플래그 초기화 (재마운트 시 구독 허용)
      console.log("SSE Disconnected");
    };
  }, [setMessage, setHasUnread]); // 의존성 배열에 스토어 함수 포함
};
