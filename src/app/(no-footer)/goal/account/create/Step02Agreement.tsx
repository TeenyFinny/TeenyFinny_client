"use client";

import { useState } from "react";
import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";

interface ConsentItem {
  id: string;
  label: string;
}

interface Step02AgreementProps {
  onNext: () => void;
}

export default function Step02Agreement({ onNext }: Step02AgreementProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [consents, setConsents] = useState<Record<string, boolean>>({
    service: false,
    privacy: false,
    identification: false,
    telecom: false,
  });

  const consentItems: ConsentItem[] = [
    { id: "service", label: "서비스 이용약관 동의" },
    { id: "privacy", label: "개인정보 수집/이용 동의" },
    { id: "identification", label: "고유식별정보처리" },
    { id: "telecom", label: "통신사 이용약관 동의" },
  ];

  const allChecked = Object.values(consents).every((checked) => checked);

  const handleAllCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !allChecked;
    setConsents((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, newValue]))
    );
  };

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
          {"휴대폰 본인확인을 위해\n필수사항에 동의해 주세요"}
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
          <BigButtonDisabled label="동의하고 진행하기" onClick={() => { }} />
        )}
      </div>
    </div>
  );
}
