"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"

/**
 * ConsentItem
 * @typedef {Object} ConsentItem
 * @property {string} id - 약관 항목의 고유 식별자입니다.
 * @property {string} label - 약관 항목의 표시 텍스트입니다.
 */
interface ConsentItem {
  id: string
  label: string
}

/**
 * Step06ProductAgreement
 *
 * 상품 가입 전 사용자가 필수 약관에 동의하도록 구성된 페이지 컴포넌트입니다.
 *
 * ### 특징
 * - 상단에는 ‘전체 동의’ 토글이 있으며, 하단에 개별 약관 항목이 표시됩니다.
 * - 각 항목은 개별적으로 선택할 수 있으며, 전체 동의 버튼으로 일괄 선택도 가능합니다.
 * - 하단에 ‘상품 주요내용 안내’, ‘상품 이해 확인’ 필드가 추가로 존재합니다.
 * - 모든 필수 항목에 동의해야 하단 버튼이 활성화됩니다.
 *
 * ### 시각적 구성
 * - 상단 제목: "상품 가입을 위해 약관을 확인해 주세요."
 * - 회색 배경의 약관 동의 필드 3개
 * - 마지막 하단에 고정된 ‘동의하고 진행하기’ 버튼
 *
 * @component
 * @returns {React.ReactElement} 상품약관 동의 페이지 구성 요소를 반환합니다.
 */
interface Step06ProductAgreementProps {
  onNext: () => void
}

export default function Step06ProductAgreement({ onNext }: Step06ProductAgreementProps) {
  /** 약관 영역 펼침 상태 관리 (true면 펼쳐짐) */
  const [isExpanded, setIsExpanded] = useState(true)
  /** 상단 약관 항목들의 체크 상태 관리 */
  const [consentsTop, setConsentsTop] = useState<Record<string, boolean>>({})
  /** 두 번째 필드(상품 주요내용 안내) 체크 상태 */
  const [consentBottom1, setConsentBottom1] = useState(false)
  /** 세 번째 필드(상품 이해 확인) 체크 상태 */
  const [consentBottom2, setConsentBottom2] = useState(false)

  /** 상단 약관 리스트 정의 */
  const consentItemsTop: ConsentItem[] = [
    { id: "1", label: "전자금융거래 기본약관" },
    { id: "2", label: "전자뱅킹서비스 이용약관" },
    { id: "3", label: "우리스마트뱅킹 사용 유의사항" },
    { id: "4", label: "[예금] 예금거래기본약관" },
    { id: "5", label: "[예금] 입출금이 자유로운예금약관" },
    { id: "6", label: "상품약관_TeenyFinny 통장" },
    { id: "7", label: "상품설명서_TeenyFinny 통장" },
    { id: "8", label: "상품 가입 전 확인사항" },
  ]

  /** 상단 약관 전체가 동의되었는지 여부 */
  const allCheckedTop =
    consentItemsTop.length > 0 && consentItemsTop.every((item) => consentsTop[item.id])

  /** 전체 동의 버튼 클릭 시 모든 항목의 체크 상태를 일괄 변경 */
  const handleAllCheckTop = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = !allCheckedTop
    const updated = Object.fromEntries(consentItemsTop.map((item) => [item.id, newValue]))
    setConsentsTop(updated)
    setIsExpanded(false)
  }

  /** 개별 항목 클릭 시 해당 항목의 체크 상태 토글 */
  const handleItemCheckTop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConsentsTop((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  /** 모든 필수 항목이 동의되었는지 확인 */
  const allChecked = allCheckedTop && consentBottom1 && consentBottom2

  return (
    <div className="relative flex flex-col h-full">
      {/** 스크롤 가능한 약관 영역 */}
      <div className="flex-1 overflow-y-auto px-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/** 타이틀 */}
        <div className="mt-[15px] mb-[20px] text-left">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"상품 가입을 위해\n약관을 확인해 주세요."}
          </h1>
        </div>

        {/** 첫 번째 필드 - 전체 동의 */}
        <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
          <div className="flex items-center justify-between">
            {/** 왼쪽: 전체 동의 체크박스 */}
            <div className="flex items-center gap-[12px] flex-1">
              <button onClick={handleAllCheckTop} className="w-[24px] h-[24px] flex items-center justify-center">
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
              <span className="text-head-06 text-neutral-1 whitespace-pre-line">[필수] 전체 동의하기</span>
            </div>

            {/** 오른쪽: 펼치기/접기 화살표 */}
            <button onClick={() => setIsExpanded(!isExpanded)}>
              <Image
                src="/icons/arrow-down.png"
                alt="토글"
                width={24}
                height={24}
                className={`${isExpanded ? "rotate-180" : "rotate-0"}`}
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                }}
              />
            </button>
          </div>
        </div>

        {/** 펼쳐진 상태일 때 표시되는 개별 약관 항목 목록 */}
        {isExpanded && (
          <div className="space-y-[15px] mb-[15px] px-[14px]">
            {consentItemsTop.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                {/** 왼쪽: 개별 약관 항목 */}
                <div className="flex items-center gap-[12px] flex-1">
                  <button onClick={(e) => handleItemCheckTop(item.id, e)}>
                    <Image
                      src={consentsTop[item.id] ? "/icons/check-green.png" : "/icons/check.png"}
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

                {/** 오른쪽: 보기 아이콘 */}
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

        {/** 두 번째 필드 - 상품 주요내용 안내 */}
        <div
          className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)]"
        >
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
            <span className="text-head-06 text-neutral-1">[필수] 상품 주요내용 안내</span>
          </div>
        </div>

        {/** 세 번째 필드 - 상품 이해 확인 (아이콘 세로 정렬 보정) */}
        <div className="bg-monochrome-gray rounded-[10px] px-[20px] py-[15px]">
          <div className="flex items-center justify-start gap-[12px]">
            <button
              onClick={() => setConsentBottom2(!consentBottom2)}
              className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center"
            >
              <Image
                src="/icons/check-circle.png"
                alt="상품 안내"
                width={24}
                height={24}
                style={{
                  filter: consentBottom2
                    ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                    : "none",
                }}
              />
            </button>
            <span className="text-head-06 text-neutral-1 leading-[20px] whitespace-pre-line">
              [필수] 본인은 약관 및 상품설명서를 제공받고 예금상품의 주요내용을 충분히 이해했습니다.
            </span>
          </div>
        </div>
      </div>

      {/** 하단 버튼 영역 */}
      <div className="flex-shrink-0 px-[24px] pb-[56px] pt-[20px]">
        {allChecked ? (
          <BigButtonActivated label="동의하고 진행하기" onClick={onNext} />
        ) : (
          <BigButtonDisabled label="동의하고 진행하기" onClick={() => {}} />
        )}
      </div>
    </div>
  )
}
