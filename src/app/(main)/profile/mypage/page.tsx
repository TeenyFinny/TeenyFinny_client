// src/app/(main)/profile/mypage/page.tsx
"use client";

import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { useRouter } from "next/navigation";
import { getProfileInfo, type ProfileInfoRes } from "@/lib/api/profile";

/**
 * MyPage
 *
 * 부모 사용자의 기본 정보를 조회하고 표시하는 마이페이지 화면입니다.
 * - 로그인한 사용자의 ID를 기반으로 프로필 정보를 불러옵니다.
 * - 이름/전화번호/이메일을 조회용 Input UI로 표시합니다.
 * - 비밀번호 변경 버튼과 탈퇴 버튼을 제공합니다.
 *
 * 주요 기능:
 * - 사용자 정보 API 요청 및 로딩/에러 상태 관리
 * - 프로필 정보 렌더링
 * - 비밀번호 변경 및 탈퇴 액션을 위한 버튼 UI 제공
 *
 * 구성 요소:
 * - NormalInput2: 조회용 사용자 정보 표시
 * - BigButtonActivated: 비밀번호 변경 버튼
 * - 탈퇴하기 버튼: 하단 고정
 */
export default function MyPage() {
  const [profileInfo, setProfileInfo] = useState<ProfileInfoRes | null>(null);
  const userId = useUserStore((state) => state.userId);
  const router = useRouter();

  useEffect(() => {
    // userId가 없으면 API 호출하지 않음 (sessionStorage에서 복원 중일 수 있음)
    if (!userId) return;

    const controller = new AbortController();

    const loadUser = async () => {
      try {
        const data = await getProfileInfo(controller.signal);

        if (controller.signal.aborted) return;

        setProfileInfo(data);
      } catch (err: any) {
        if (controller.signal.aborted || err?.name === "CanceledError") return;

        if (process.env.NODE_ENV === "development") {
          console.error("사용자 정보를 불러오지 못했습니다.", err);
        }
      }
    };

    loadUser();

    return () => {
      controller.abort();
    };
  }, [userId]);

  const handleChangeInfo = () => {
    router.push("/verify");
  };

  // verify 페이지에서 돌아왔을 때 프로필 정보 다시 불러오기
  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        const controller = new AbortController();
        const loadUser = async () => {
          try {
            const data = await getProfileInfo(controller.signal);
            if (!controller.signal.aborted) {
              setProfileInfo(data);
            }
          } catch (err: any) {
            if (!controller.signal.aborted && process.env.NODE_ENV === "development") {
              console.error("사용자 정보를 불러오지 못했습니다.", err);
            }
          }
        };
        loadUser();
        return () => controller.abort();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId]);

  return (
    <main className="px-6 overflow-y-auto">
      {/* 타이틀 */}
      <div className="pt-[36px] pb-[30px] text-left flex items-center">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          내 정보 관리
        </h1>
      </div>

      {/* information */}
      <div className="flex flex-col justify-start items-center gap-6">
        <div onClick={handleChangeInfo}>
          <NormalInput2
            label="이름"
            placeholder=""
            value={profileInfo?.user?.name ?? ""}
            onChange={() => {}}
          />
        </div>

        <div onClick={handleChangeInfo}>
          <NormalInput2
            label="전화번호"
            placeholder=""
            value={profileInfo?.user?.phoneNumber ?? ""}
            onChange={() => {}}
          />
        </div>

        <NormalInput2
          label="이메일"
          placeholder=""
          value={profileInfo?.user?.email ?? ""}
          disabled={true}
          onChange={() => {}}
        />
      </div>

      {/* 비밀번호 변경 */}
      <div className="mt-6">
        <BigButtonActivated
          label="비밀번호 변경하기"
          onClick={() => router.push("/profile/mypage/password")}
        />
      </div>

      {/* 탈퇴 */}
      <button className="fixed bottom-[134px] w-full max-w-[327px] text-center text-body-08 text-neutral-3">
        탈퇴하기
      </button>
    </main>
  );
}
