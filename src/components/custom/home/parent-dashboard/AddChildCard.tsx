"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";

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
      // TODO: 간편 비밀번호 인증 API 호출

      // 임시 처리: API가 구현되기 전까지는 인증 없이 바로 이동 (개발용)
      setIsPasswordModalOpen(false);
      router.push("/family");
    } catch (err) {
      // 에러 처리 (API 구현 후 활성화)
      // 에러 발생 시 모달은 열어둠 (재시도 가능)
      if (process.env.NODE_ENV === "development") {
        console.error("간편 비밀번호 인증 실패:", err);
      }
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
        setOpen={setIsPasswordModalOpen}
        onComplete={handlePasswordComplete}
        title="간편 비밀번호"
        shouldOverlayBottomBar={true}
      />
    </>
  );
}
