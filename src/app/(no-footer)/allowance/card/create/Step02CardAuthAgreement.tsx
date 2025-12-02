"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";

/**
 * ConsentItem
 * @typedef {Object} ConsentItem
 * @property {string} id - 동의 항목의 고유 식별자
 * @property {string} label - 동의 항목의 표시 텍스트
 */
interface ConsentItem {
  id: string;
  label: string;
}

/**
 * Step02CardAuthAgreement
 *
 * 카드 발급을 위한 필수 약관 동의 페이지입니다.
 *
 * ### 특징
 * - 전체 동의 체크박스를 통해 모든 하위 항목을 한번에 동의할 수 있습니다.
 * - 전체 동의 섹션은 토글 가능하며, 열림/닫힘 상태를 제어할 수 있습니다.
 * - 개별 동의 항목은 각각 체크/해제할 수 있습니다.
 * - 모든 항목에 동의해야 "동의하고 진행하기" 버튼이 활성화됩니다.
 *
 * ### 시각적 구성
 * - 체크되지 않은 항목: `text-monochrome-gray` (회색)
 * - 체크된 항목: `text-success` (녹색)
 * - 모든 항목 체크 시 버튼: `text-primary-1` (파란색)
 *
 * @component
 * @returns {React.ReactElement} 약관 동의 페이지
 */

interface Step02CardAuthAgreementProps {
  onNext: () => void;
}

export default function Step02CardAuthAgreement({
  onNext,
}: Step02CardAuthAgreementProps) {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [consents, setConsents] = useState<Record<string, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const consentItems: ConsentItem[] = [
    { id: "1", label: "개인(신용)정보 필수적 동의서" },
    { id: "2", label: "우리카드발급을 위한 필수 동의 및 확인사항" },
    { id: "3", label: "본인정보 제3자 제공요구 필수적 동의서" },
  ];
  // 모든 항목이 체크되었는지 확인
  const allChecked = Object.values(consents).every((checked) => checked);

  /**
   * 전체 동의 체크박스 클릭 시 모든 하위 항목을 일괄 체크/해제합니다.
   */
  const handleAllCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !allChecked;
    setConsents((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, newValue]))
    );
  };
  /**
   * 개별 동의 항목 체크박스 클릭 시 해당 항목의 체크 상태를 토글합니다.
   *
   * @param {string} id - 동의 항목의 고유 식별자
   */
  const handleItemCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col px-[24px]">
      {/* 타이틀 */}
      <div className="mt-[43px] mb-[26px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"카드 신청을 위해\n약관을 확인해 주세요"}
        </h1>
      </div>

      {/* 전체 동의 영역 */}
      <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px] flex-1">
            {/* 전체 동의 체크 */}
            <button
              onClick={handleAllCheck}
              className="w-[24px] h-[24px] flex items-center justify-center"
            >
              <Image
                src="/icons/check-circle.png"
                alt="전체 동의"
                width={24}
                height={24}
                style={{
                  filter: allChecked
                    ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                    : "none",
                }}
              />
            </button>

            {/* 전체 동의 텍스트 */}
            <span className="text-head-06 text-neutral-1">
              휴대폰 본인확인 약관
            </span>
          </div>

          {/* 토글 버튼 */}
          <button onClick={() => setIsExpanded(!isExpanded)}>
            <Image
              src="/icons/arrow-down.png"
              alt="토글"
              width={24}
              height={24}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
              }}
              className={`${isExpanded ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>
      </div>
      {/* 개별 항목 */}
      {isExpanded && (
        <div className="space-y-[15px] mb-[40px] px-[14px]">
          {consentItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[12px] flex-1">
                <button onClick={(e) => handleItemCheck(item.id, e)}>
                  <Image
                    src={
                      consents[item.id]
                        ? "/icons/check-green.png"
                        : "/icons/check.png"
                    }
                    alt="체크"
                    width={24}
                    height={24}
                    style={{
                      filter: consents[item.id]
                        ? "none"
                        : "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                    }}
                  />
                </button>
                <span className="text-body-02">{item.label}</span>
              </div>

              {/* 오른쪽 화살표 */}
              <Image
                src="/icons/arrow-right.png"
                alt="보기"
                width={24}
                height={24}
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-[327px]">
        {allChecked ? (
          <BigButtonActivated label="동의하고 진행하기" onClick={onNext} />
        ) : (
          <BigButtonDisabled label="동의하고 진행하기" onClick={() => {}} />
        )}
      </div>
    </div>
  );
}
