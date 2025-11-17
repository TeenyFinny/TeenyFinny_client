"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword" // ✅ 바텀시트 import

interface ConsentItem {
  id: string
  label: string
}

export default function GoalAccountCreateTermsPage() {
  const router = useRouter()

  /** 약관 영역 상태 */
  const [isExpanded, setIsExpanded] = useState(true)
  const [consentsTop, setConsentsTop] = useState<Record<string, boolean>>({})
  const [consentBottom1, setConsentBottom1] = useState(false)
  const [consentBottom2, setConsentBottom2] = useState(false)

  /** 바텀시트 열림 상태 */
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  /** 약관 항목 */
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

  /** 전체 동의 여부 */
  const allCheckedTop = consentItemsTop.every((item) => consentsTop[item.id])
  const allChecked = allCheckedTop && consentBottom1 && consentBottom2

  /** 전체 동의 클릭 */
  const handleAllCheckTop = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = !allCheckedTop
    const updated = Object.fromEntries(consentItemsTop.map((item) => [item.id, newValue]))
    setConsentsTop(updated)
  }

  /** 개별 항목 토글 */
  const handleItemCheckTop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConsentsTop((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  /** 다음 단계 → 비밀번호 입력 바텀시트 오픈 */
  const handleNext = () => {
    if (allChecked) setIsSheetOpen(true)
  }

  /** 비밀번호 입력 완료 후 → 완료 페이지로 이동 */
  const handlePinComplete = (pin: string) => {
    console.log("✅ 입력된 비밀번호:", pin)
    setIsSheetOpen(false)
    router.push("/goal/account/create/confirm") // ✅ 이동 경로 수정 완료
  }

  return (
    <div className="relative flex flex-col h-full bg-primary-4">
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* 타이틀 */}
        <div className="mt-[43px] mb-[26px] text-left">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"상품 가입을 위해\n약관을 확인해 주세요."}
          </h1>
        </div>

        {/* 전체 동의 */}
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

        {/* 개별 약관 목록 */}
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

        {/* 상품 주요내용 안내 */}
        <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)]">
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

        {/* 상품 이해 확인 */}
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

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 px-[24px] pb-[56px] pt-[20px]">
        {allChecked ? (
          <BigButtonActivated label="동의하고 진행하기" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="동의하고 진행하기" onClick={() => {}} />
        )}
      </div>

      {/* ✅ 비밀번호 입력 바텀시트 */}
      <BottomSheetPassword
        open={isSheetOpen}
        setOpen={setIsSheetOpen}
        onComplete={handlePinComplete}
        title="출금계좌 비밀번호"
        pinLength={4}
        shouldOverlayBottomBar
      />
    </div>
  )
}
