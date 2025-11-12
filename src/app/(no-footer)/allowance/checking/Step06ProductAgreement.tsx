"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"

interface ConsentItem {
  id: string
  label: string
}

export default function Step06ProductAgreement() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [consentsTop, setConsentsTop] = useState<Record<string, boolean>>({})
  const [consentBottom1, setConsentBottom1] = useState(false)
  const [consentBottom2, setConsentBottom2] = useState(false)

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

  const allCheckedTop = consentItemsTop.length > 0 && consentItemsTop.every((item) => consentsTop[item.id])

  const handleAllCheckTop = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = !allCheckedTop
    const updated = Object.fromEntries(consentItemsTop.map((item) => [item.id, newValue]))
    setConsentsTop(updated)
  }

  const handleItemCheckTop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConsentsTop((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const allChecked = allCheckedTop && consentBottom1

  const handleNext = () => {
    console.log("동의 완료")
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* 타이틀 */}
        <div className="mt-[43px] mb-[26px] text-left">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"상품 가입을 위해\n약관을 확인해 주세요."}
          </h1>
        </div>

        {/* 1️⃣ 첫 번째 회색 필드 */}
        <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
          <div className="flex items-center justify-between">
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

            <button onClick={() => setIsExpanded(!isExpanded)}>
              <Image
                src="/icons/arrow-down.png"
                alt="토글"
                width={24}
                height={24}
                className={`${isExpanded ? "rotate-0" : "rotate-180"}`}
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                }}
              />
            </button>
          </div>
        </div>

        {/* 첫 번째 필드 펼침 내용 */}
        {isExpanded && (
          <div className="space-y-[15px] mb-[15px] px-[14px]">
            {consentItemsTop.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
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

        {/* 2️⃣ 두 번째 필드 */}
        <div
          className={`${
            isExpanded ? "mb-[27px]" : "mb-[15px]"
          } bg-monochrome-gray rounded-[10px] px-[20px] py-[16px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)]`}
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

        {/* 3️⃣ 세 번째 필드 */}
        <div className="bg-monochrome-gray rounded-[10px] px-[20px] py-[20px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] mb-[20px]">
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
                  filter: consentBottom2
                    ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                    : "none",
                }}
              />
            </button>

            <span className="text-head-06 text-neutral-1 leading-[20px]">
              [필수] 본인은 예금상품의 주요내용을 충분히 이해했습니다.
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 px-[24px] pb-[56px] pt-[20px]">
        <div className="">
          {allChecked ? (
            <BigButtonActivated label="동의하고 진행하기" onClick={handleNext} />
          ) : (
            <BigButtonDisabled label="동의하고 진행하기" onClick={() => {}} />
          )}
        </div>
      </div>
    </div>
  )
}
