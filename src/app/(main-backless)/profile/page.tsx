// app/(main-backless)/profile/page.tsx
"use client";

import ParentMyPage from "@/components/custom/profile/ParentMyPage";
import ChildMyPage from "@/components/custom/profile/ChildMyPage";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { PushNotification } from "@/components/ui/notice/PushNotification";
import { useNotificationStore } from "@/store/notificationStore";
import { useRouter } from "next/navigation";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";

/**
 * MyProfilePage
 *
 * 사용자 유형(parent/child)에 따라 각각의 마이페이지 화면을 렌더링하는 컴포넌트입니다.
 * - PushNotification 전역 store 메시지를 감지하여 상단 알림을 표시합니다.
 * - 알림은 profile 페이지 진입 시 자동 재생되며, 3.5초 뒤 사라집니다.
 * - hydration mismatch 방지를 위해 `isMounted`로 초기 렌더링을 제어합니다.
 *
 * @returns {JSX.Element | null} 프로필 화면 또는 초기 null 렌더링
 */
export default function MyProfilePage() {
  const router = useRouter();
  /** 사용자 타입 (parent | child | null) */
  const userType = useUserStore((state) => state.userType);
  /** 클라이언트 마운트 여부 */
  const [isMounted, setIsMounted] = useState(false);
  /** 전역 PushNotification 상태 */
  const { message, setMessage } = useNotificationStore();
  /** PushNotification 표시 여부 */
  const [open, setOpen] = useState(false);
  /** 로그인 모달 상태 */
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  /**
   * 클라이언트에서만 렌더링하도록 보장합니다.
   * SSR/Hydration 오류 방지를 위한 마운트 체크.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // message가 설정되면 자동으로 PushNotification 실행
  useEffect(() => {
    if (message) {
      setOpen(true);

      // 알림이 닫히고 난 뒤 message 초기화
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  // 로그인 필요 시 모달 띄우기
  useEffect(() => {
    if (isMounted && !userType) {
      setLoginModalOpen(true);
    }
  }, [isMounted, userType]);

  if (!isMounted) return null;

  return (
    <main className="relative">

      {/* 로그인 필요 모달 */}
      <TitleOnlyDialog
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        title={"로그인이 필요합니다.\n로그인 화면으로 이동합니다."}
        
        confirmText="확인"
        onConfirm={() => router.push("/login")}
      />

      {/* Push Notification (페이지 상단 고정) */}
      <PushNotification
        open={open}
        setOpen={setOpen}
        message={message ?? ""}
      />

      {/* 실제 프로필 페이지 렌더 */}
      {userType === "parent" ? <ParentMyPage /> : <ChildMyPage />}
    </main>
  );
}
