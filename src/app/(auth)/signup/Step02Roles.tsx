"use client";

import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";

/**
 * Step02Roles
 *
 * 회원가입 단계 2: 부모 / 자녀 역할 선택 페이지
 *
 * @param selectedRole - 현재 선택된 역할 ("PARENT" | "CHILD" | null)
 * @param onSelect - 역할 선택 시 호출되는 콜백
 * @param onNext - 다음 단계로 이동하는 함수
 *
 */
type Step02RolesProps = Readonly<{
  selectedRole: "PARENT" | "CHILD" | null;
  onSelect: (role: "PARENT" | "CHILD") => void;
  onNext: () => void;
}>;

export default function Step02Roles({
  selectedRole,
  onSelect,
  onNext,
}: Step02RolesProps) {
  return (
    <main className="flex flex-col">
      <div className="pt-[34px] pb-[26px] text-left">
        <h2 className="text-head-01 text-neutral-1 whitespace-pre-line">
          역할을 선택해 주세요
        </h2>

        <div className="flex justify-between gap-4 pt-[112px]">
          {/* 부모 */}
          <button
            type="button"
            onClick={() => onSelect("PARENT")}
            className={`flex flex-col items-center justify-center w-[151px] h-[237px] p-6 rounded-2xl border-2 ${
              selectedRole === "PARENT"
                ? "border-primary-1 bg-neutral-7"
                : "border-neutral-4 bg-neutral-7"
            } transition`}
          >
            <Image
              src="/images/auth/icon_auth_parent.svg"
              alt="부모 아이콘"
              width={127}
              height={127}
            />
            <span className="text-head-06 mt-[27px] font-medium text-neutral-1">
              부모
            </span>
          </button>

          {/* 자녀 */}
          <button
            type="button"
            onClick={() => onSelect("CHILD")}
            className={`flex flex-col items-center justify-center w-1/2 p-6 rounded-2xl border-2 ${
              selectedRole === "CHILD"
                ? "border-primary-1 bg-neutral-7"
                : "border-neutral-4 bg-neutral-7"
            } transition`}
          >
            <Image
              src="/images/auth/icon_auth_child.svg"
              alt="자녀 아이콘"
              width={127}
              height={127}
            />
            <span className="text-head-06 mt-[27px] font-medium text-neutral-1">
              자녀
            </span>
          </button>
        </div>
      </div>

      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {selectedRole ? (
          <BigButtonActivated label="다음" onClick={onNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>
    </main>
  );
}
