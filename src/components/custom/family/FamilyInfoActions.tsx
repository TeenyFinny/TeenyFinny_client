// src/components/custom/family/FamilyInfoActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { useEffect } from "react";

/**
 * FamilyInfoActions
 *
 * 가족 등록 인트로 페이지(/family/info) 하단의 "확인" 버튼 및
 * 사용자 유형에 따라 자동 리다이렉트를 처리하는 클라이언트 전용 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 부모 유저(parent)일 경우 `/home` 페이지로 자동 이동
 * - 자녀 유저(child)일 경우 “확인” 클릭 시 `/family` 페이지로 이동 (OTP 입력 화면)
 *
 * ### 동작 흐름
 * 1. 컴포넌트 마운트 후 `userType === "parent"`이면 즉시 `/home`으로 리다이렉트
 * 2. 버튼 클릭 시 otp 입력 페이지(`/family`)로 이동
 *
 * ### 사용 위치
 * - `/family/info/page.tsx` (서버 컴포넌트)에서 클라이언트 인터랙션 영역으로 분리하여 사용
 *
 * @component
 * @returns {JSX.Element}
 * 가족 등록 안내 페이지의 하단 CTA 버튼 렌더링
 */
export function FamilyInfoActions() {
  const router = useRouter();
  const { userType } = useUserStore();

  /**
   * 부모 사용자인 경우 인트로 페이지 접근을 허용하지 않고,
   * 곧바로 홈 화면으로 이동시킴.
   */
  useEffect(() => {
    if (userType === "parent") {
      router.push("/home");
    }
  }, [userType, router]);

  /**
   * “확인” 버튼 클릭 시 가족 등록(OTP) 페이지로 이동
   */
  const handleConfirm = () => {
    router.push("/family");
  };

  return (
    <div className="fixed bottom-[134px] w-full max-w-[327px]">
      <BigButtonActivated label="확인" onClick={handleConfirm} />
    </div>
  );
}
