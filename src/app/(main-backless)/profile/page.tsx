// app/(main-backless)/profile/page.tsx
"use client";

import ParentMyPage from "@/components/custom/profile/ParentMyPage";
import ChildMyPage from "@/components/custom/profile/ChildMyPage";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";

export default function MyProfilePage() {
  const { userType } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // TODO: API 연동 후 초기 로딩 처리 로직으로 대체 예정
  }

  if (!userType) return <div>로그인이 필요합니다.</div>;

  return userType === "parent" ? <ParentMyPage /> : <ChildMyPage />;
}
