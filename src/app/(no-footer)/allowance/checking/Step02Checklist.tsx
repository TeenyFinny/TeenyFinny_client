"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Bell } from "lucide-react";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";

/**
 * Step2Page
 *
 * 계좌 개설 전 필요 서류 안내 페이지입니다.
 *
 * ### 특징
 * - 계좌 개설 시 준비해야 할 서류를 안내합니다.
 * - 중앙에 시각적 일러스트를 표시합니다.
 * - 확인 버튼 클릭 시 다음 단계(step3)로 라우팅됩니다.
 * - 뒤로가기 및 알림 버튼을 헤더에 포함합니다.
 *
 * @component
 * @returns {React.ReactElement} 계좌 개설 전 확인 페이지
 *
 * @example
 * ```tsx
 * // app/step2/page.tsx
 * export default function Step2Page() { ... }
 * ```
 */
interface Step2ChecklistProps {
  onNext: () => void; // 이게 핵심
}
export default function Step02Checklist({ onNext }: Step2ChecklistProps) {
  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <main className="flex flex-1 flex-col px-[46px] pt-[32px] pb-[46px]">
        {/* Title Section */}
        <div className="mb-[32px]">
          <h1 className="text-landing-01 text-[#000000] whitespace-pre-line mb-[24px]">
            {"계좌 개설 전에\n미리 확인해 주세요"}
          </h1>

          <div className="space-y-[8px]">
            <h2 className="text-head-04 text-[#000000]">
              알아서 준비해주는 서류
            </h2>
            <p className="text-body-07 text-[#000000] leading-relaxed">
              필요한 서류는 스크래핑을 통해 대부분에서 자동으로 발급해주지
              <br />
              니까,{" "}
              <span className="text-[#0067ac]">
                부모님 본인 명의 휴대폰
              </span>, <span className="text-[#0067ac]">신분증</span>만 준비하면
              빠른 개설이
              <br />
              가능해요
            </p>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="mb-[60px] flex flex-1 items-center justify-center">
          <div className="h-[300px] w-[300px] rounded-[20px] bg-[#e8f4fc]" />
        </div>

        {/* Confirmation Text */}
        <p className="text-body-07 text-[#000000] text-center mb-[20px]">
          자녀가 보유한 계좌가 없습니다.
        </p>

        {/* Confirm Button */}
        <div className="flex flex-col gap-5 items-center mb-[56px]">
          <BigButtonActivated label="네, 확인했어요" onClick={onNext} />
        </div>
      </main>
    </div>
  );
}
