// components/custom/home/parent-dashboard/AddChildCard.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

/**
 * 자녀 추가 카드 컴포넌트.
 *
 * @returns {JSX.Element} 자녀 추가 버튼 요소.
 */
export default function AddChildCard() {
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  /**
   * 간편 비밀번호 입력 완료 시 호출되는 핸들러
   * 간편 비밀번호를 인증하고 성공 시 가족 등록 페이지로 이동합니다.
   */
  const handlePasswordComplete = async (simplePassword: string) => {
    try {
      const res = await api.post(requests.verifySimplePassword, {
        simplePassword,
      });

      if (res.data?.matched === true) {
        setIsPasswordModalOpen(false);
        router.push("/family");
      } else {
        // TODO: BottomSheetPassword 에러메시지 처리 필요
        alert("간편 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("간편 비밀번호 인증 실패:", err);
      }
      alert("간편 비밀번호 인증에 실패했습니다.");
    }
  };

  return (
    <>
      <button
        className="relative w-full h-[217px] rounded-2xl bg-primary-1/10"
        onClick={() => {
          setIsPasswordModalOpen(true);
        }}
      >
        <span className="absolute top-6 left-6 text-body-05 text-neutral-3">
          자녀 추가하기
        </span>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center">
            <Plus className="size-8 text-neutral-3" />
          </div>
        </div>
      </button>

      {/* 간편 비밀번호 입력 모달 */}
      <BottomSheetPassword
        open={isPasswordModalOpen}
        setOpen={(open) => {
          setIsPasswordModalOpen(open);
        }}
        onComplete={handlePasswordComplete}
        title="간편 비밀번호"
        shouldOverlayBottomBar={true}
      />
    </>
  );
}
