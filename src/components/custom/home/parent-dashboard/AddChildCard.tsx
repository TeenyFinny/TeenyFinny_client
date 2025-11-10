"use client";

import { Plus } from "lucide-react";

/**
 * 자녀 추가 카드 컴포넌트.
 *
 * @returns {JSX.Element} 자녀 추가 버튼 요소.
 */
export default function AddChildCard() {
  return (
    <button
      className="relative w-full h-[217px] rounded-2xl bg-primary-1/10"
      onClick={() => {
        console.log("Navigate to add child page");
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
  );
}
