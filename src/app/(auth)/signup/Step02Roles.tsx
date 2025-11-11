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

        <div className="flex gap-4 pt-[112px]">
          {[
            {
              role: "PARENT",
              label: "부모",
              icon: "/images/auth/icon_auth_parent.svg",
            },
            {
              role: "CHILD",
              label: "자녀",
              icon: "/images/auth/icon_auth_child.svg",
            },
          ].map(({ role, label, icon }) => (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role as "PARENT" | "CHILD")}
              className={`flex flex-1 flex-col items-center justify-center h-[237px] p-6 rounded-2xl border-2 ${
                selectedRole === role
                  ? "border-primary-1 bg-neutral-7"
                  : "border-neutral-4 bg-neutral-7"
              } transition`}
            >
              <Image
                src={icon}
                alt={`${label} 아이콘`}
                width={127}
                height={127}
              />
              <span className="text-head-06 mt-[27px] font-medium text-neutral-1">
                {label}
              </span>
            </button>
          ))}
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
