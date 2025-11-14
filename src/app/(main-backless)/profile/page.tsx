// app/(main-backless)/profile/page.tsx
"use client";

import ParentMyPage from "@/components/custom/profile/ParentMyPage";
import ChildMyPage from "@/components/custom/profile/ChildMyPage";
import { useUserStore } from "@/store/userStore";

export default function MyProfilePage() {
  const { userType } = useUserStore();

  if (!userType) return <div>로그인이 필요합니다.</div>;

  return userType === "parent" ? <ParentMyPage /> : <ChildMyPage />;
}
