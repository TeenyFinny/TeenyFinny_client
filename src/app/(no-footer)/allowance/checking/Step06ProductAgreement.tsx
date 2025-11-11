"use client";

import { useState } from "react";
import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";

/**
 * @typedef {Object} ConsentItem
 * @property {string} id - 동의 항목 고유 ID
 * @property {string} label - 항목에 표시될 텍스트
 */
interface ConsentItem {
  id: string;
  label: string;
}

/**
 * Step06ProductAgreement
 *
 * 상품 가입 전 필수 약관 동의 화면 컴포넌트입니다.
 *
 * ### 특징
 * - 상단: 여러 개 약관 항목을 포함한 `[필수] 전체 동의하기` 박스
 * - 중단: `[필수] 상품 주요내용 안내` 개별 박스 (하나의 체크만 존재)
 * - 하단: 동일한 `[필수] 상품 주요내용 안내` 형태로, 버튼 뒤에 일부 겹쳐 보이도록 구현
 * - 버튼은 세 필드의 모든 체크가 완료되어야 활성화됩니다.
 *
 * ### 비고
 * - 각 회색 필드는 완전히 독립적이며, 서로 영향을 주지 않습니다.
 * - UI, 간격, 색상, 그림자 등은 디자인 원본과 동일하게 유지되었습니다.
 */
export default function Step06ProductAgreement({
  onNext,
}: {
  onNext: () => void;
}) {
  /** 전체 약관(첫 번째 회색 필드)의 펼침 여부 */
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  /** 첫 번째 회색 필드용 다중 동의 상태 */
  const [consentsTop, setConsentsTop] = useState<Record<string, boolean>>({});

  /** 두 번째, 세 번째 필드는 개별 단일 체크 상태 */
  const [consentBottom1, setConsentBottom1] = useState<boolean>(false);
  const [consentBottom2, setConsentBottom2] = useState<boolean>(false);

  /** 첫 번째 회색 필드의 개별 약관 목록 */
  const consentItemsTop: ConsentItem[] = [
    { id: "1", label: "전자금융거래 기본약관" },
    { id: "2", label: "전자뱅킹서비스 이용약관" },
    { id: "3", label: "우리스마트뱅킹 사용 유의사항" },
    { id: "4", label: "[예금] 예금거래기본약관" },
    { id: "5", label: "[예금] 입출금이 자유로운예금약관" },
    { id: "6", label: "상품약관_TeenyFinny 통장" },
    { id: "7", label: "상품설명서_TeenyFinny 통장" },
    { id: "8", label: "상품 가입 전 확인사항" },
  ];

  /** 첫 번째 회색 필드 - 전체 동의 여부 */
  const allCheckedTop =
    consentItemsTop.length > 0 &&
    consentItemsTop.every((item) => consentsTop[item.id]);

  /**
   * 첫 번째 회색 필드 - 전체 동의 버튼 클릭 시
   * 모든 하위 항목의 체크 상태를 일괄 토글합니다.
   */
  const handleAllCheckTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !allCheckedTop;
    const updated = Object.fromEntries(
      consentItemsTop.map((item) => [item.id, newValue])
    );
    setConsentsTop(updated);
  };

  /**
   * 첫 번째 회색 필드 - 개별 항목 클릭 시
   * 해당 항목의 체크 상태만 토글합니다.
   */
  const handleItemCheckTop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConsentsTop((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /** 모든 필수 동의 항목이 체크되어야 버튼 활성화 */
  const allChecked = allCheckedTop && consentBottom1;

  return (
    <div className="relative flex flex-col px-[24px]">
      {/* 타이틀 영역 */}
      <div className="mt-[43px] mb-[26px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"상품 가입을 위해\n약관을 확인해 주세요."}
        </h1>
      </div>

      {/* 첫 번째 회색 필드 - 전체 동의 */}
      <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 체크박스 + 텍스트 */}
          <div className="flex items-center gap-[12px] flex-1">
            <button
              onClick={handleAllCheckTop}
              className="w-[24px] h-[24px] flex items-center justify-center"
            >
              <Image
                src="/icons/check-circle.png"
                alt="전체 동의"
                width={24}
                height={24}
                style={{
                  filter: allCheckedTop
                    ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                    : "none",
                }}
              />
            </button>

            <span className="text-head-06 text-neutral-1 whitespace-pre-line">
              [필수] 전체 동의하기
            </span>
          </div>

          {/* 오른쪽: 펼치기 / 접기 토글 */}
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
              className={`${isExpanded ? "rotate-0" : "rotate-180"}`}
            />
          </button>
        </div>
      </div>

      {/* 첫 번째 필드 - 개별 약관 항목 리스트 */}
      {isExpanded && (
        <div className="space-y-[15px] mb-[15px] px-[14px]">
          {consentItemsTop.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[12px] flex-1">
                {/* 개별 체크 버튼 */}
                <button onClick={(e) => handleItemCheckTop(item.id, e)}>
                  <Image
                    src={
                      consentsTop[item.id]
                        ? "/icons/check-green.png"
                        : "/icons/check.png"
                    }
                    alt="체크"
                    width={24}
                    height={24}
                    style={{
                      filter: consentsTop[item.id]
                        ? "none"
                        : "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                    }}
                  />
                </button>
                <span className="text-body-02">{item.label}</span>
              </div>

              {/* 오른쪽 화살표 아이콘 */}
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

      {/* 두 번째 회색 필드 - 단일 필수 동의 */}
      <div className="mb-[34px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-start gap-[12px]">
          <button
            onClick={() => setConsentBottom1(!consentBottom1)}
            className="w-[24px] h-[24px] flex items-center justify-center"
          >
            <Image
              src="/icons/check-circle.png"
              alt="상품 안내"
              width={24}
              height={24}
              style={{
                filter: consentBottom1
                  ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                  : "none",
              }}
            />
          </button>

          <span className="text-head-06 text-neutral-1">
            [필수] 상품 주요내용 안내
          </span>
        </div>
      </div>

      {/* 세 번째 회색 필드 - 버튼 뒤에 살짝 겹치는 박스 */}
      <div className="absolute bottom-[74px] left-[24px] right-[24px] bg-monochrome-gray rounded-[10px] px-[20px] py-[15px]">
        <div className="flex items-center justify-start gap-[12px]">
          <button
            onClick={() => setConsentBottom2(!consentBottom2)}
            className="w-[24px] h-[24px] flex items-center justify-center"
          >
            <Image
              src="/icons/check-circle.png"
              alt="상품 안내"
              width={24}
              height={24}
              style={{
                filter: "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
              }}
            />
          </button>

          <span className="text-head-06 text-neutral-3">
            [필수] 상품 주요내용 안내
          </span>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex flex-col gap-5 items-center mb-[56px] drop-shadow-[0_-4px_10px_rgba(0,0,0,0.25)]">
        <div className="shadow-[0_-4px_10px_rgba(0,0,0,0.25)] rounded-[14px]">
          {allChecked ? (
            <BigButtonActivated label="동의하고 진행하기" onClick={onNext} />
          ) : (
            <BigButtonDisabled label="동의하고 진행하기" onClick={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}
