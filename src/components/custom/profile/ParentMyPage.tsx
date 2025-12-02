"use client"

import MyPageBase from "./MyPageBase"

export default function ParentMyPage() {
  const menu = [
    { label: "내 정보 관리", route: "/profile/mypage", requireAuth: true },
    { label: "가족 관리", route: "/profile/family" },
    { label: "간편 비밀번호 설정", route: "/profile/simple-password", requireAuth: true },
    { label: "서비스 알림 설정", route: "/profile/notification" },
    { label: "서비스 이용 약관", route: "/profile/terms" },
  ] as const

  return <MyPageBase menu={menu} />
}
