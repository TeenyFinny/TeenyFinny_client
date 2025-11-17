"use client";

import { useRouter } from "next/navigation";
import MyPageItem from "./MyPageItem";

export default function ChildMyPage() {
  const router = useRouter();

  return (
    <main className="px-[24px] pt-6 flex flex-col gap-[24px]">
      <MyPageItem
        label="내 정보 관리"
        onClick={() => router.push("/profile/mypage")}
      />
      <MyPageItem
        label="간편 비밀번호 설정"
        onClick={() => router.push("/profile/simple-password")}
      />
      <MyPageItem
        label="서비스 알림 설정"
        onClick={() => router.push("/profile/notification")}
      />
      <MyPageItem
        label="서비스 이용 약관"
        onClick={() => router.push("/profile/terms")}
      />
    </main>
  );
}
