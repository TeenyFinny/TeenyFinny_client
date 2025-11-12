"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword" // ✅ 경로 확인!

interface ConsentItem {
  id: string
  label: string
}

export default function GoalAccountCreateTermsPage() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)

  // ✅ 약관 목록
  const consentItems: ConsentItem[] = [
    { id: "deposit-basic", label: "[예금] 예금거래기본약관" },
    { id: "deposit-installment", label: "[예금] 적립식예금약관" },
    { id: "auto-transfer", label: "계좌 간 자동 이체 약관" },
    { id: "tax-exemption", label: "[예금] 비과세종합저축 특약" },
    { id: "goal-savings-terms", label: "상품약관_목표 적금" },
    { id: "goal-savings-guide", label: "상품설명서_목표 적금" },
    { id: "restriction", label: "구속행위 금지 안내" },
    { id: "pre-check", label: "상품 가입 전 확인사항" },
  ]

  // ✅ 초기 동의 상태
  const initialConsents = useMemo(
    () => Object.fromEntries(consentItems.map((item) => [item.id, false])),
    []
  )
  const [consents, setConsents] = useState<Record<string, boolean>>(initialConsents)

  // ✅ 전체 체크 여부
  const allChecked = Object.values(consents).every(Boolean)

  // ✅ 바텀시트 상태
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false)

  // ✅ 전체 체크/해제
  const handleAllCheck = () => {
    const newValue = !allChecked
    setConsents(Object.fromEntries(Object.keys(consents).map((key) => [key, newValue])))
  }

  // ✅ 개별 항목 체크
  const handleItemCheck = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // ✅ 다음 단계 이동
  const handleNext = () => {
    // router.push("/goal/account/create/auth") ← 기존은 auth였지만
    // 이제 비밀번호 설정이 들어오므로 바텀시트를 띄워야 함
    setIsPasswordSheetOpen(true)
  }

  // ✅ 비밀번호 입력 완료 시
  const handlePasswordComplete = (pin: string) => {
    console.log("입력된 PIN:", pin)
    setIsPasswordSheetOpen(false)
    router.push("/goal/account/create/confirm") // ✅ 완료 페이지로 이동
  }

  return (
    <>
      <div className="flex flex-col px-[24px]">
        {/* 타이틀 */}
        <div className="mt-[43px] mb-[26px] text-left">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"상품 가입을 위해\n약관을 확인해 주세요"}
          </h1>
        </div>

        {/* 전체 동의 */}
        <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px] flex-1">
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
                      ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg)"
                      : "none",
                  }}
                />
              </button>
              <span className="text-head-06 text-neutral-1">[필수] 전체 동의하기</span>
            </div>

            {/* 토글 버튼 */}
            <button onClick={() => setIsExpanded(!isExpanded)}>
              <Image
                src="/icons/arrow-down.png"
                alt="토글"
                width={24}
                height={24}
                className={`${isExpanded ? "rotate-0" : "rotate-180"} transition-transform`}
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
                  <button onClick={() => handleItemCheck(item.id)}>
                    <Image
                      src={
                        consents[item.id]
                          ? "/icons/check-green.png"
                          : "/icons/check.png"
                      }
                      alt="체크"
                      width={24}
                      height={24}
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
                />
              </div>
            ))}
          </div>
        )}

        {/* 버튼 */}
        <div
          className={`flex flex-col gap-5 items-center mb-[56px] ${
            isExpanded ? "mt-[221px]" : "mt-[402px]"
          }`}
        >
          {allChecked ? (
            <BigButtonActivated label="동의하고 진행하기" onClick={handleNext} />
          ) : (
            <BigButtonDisabled label="동의하고 진행하기" onClick={() => {}} />
          )}
        </div>
      </div>

      {/* ✅ 비밀번호 바텀시트 */}
      <BottomSheetPassword
        open={isPasswordSheetOpen}
        setOpen={setIsPasswordSheetOpen}
        onComplete={handlePasswordComplete}
      />
    </>
  )
}
