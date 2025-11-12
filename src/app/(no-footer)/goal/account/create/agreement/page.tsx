"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"

interface ConsentItem {
  id: string
  label: string
}

export default function GoalAccountCreateAgreementPage() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)

  const consentItems: ConsentItem[] = [
    { id: "service", label: "서비스 이용약관 동의" },
    { id: "privacy", label: "개인정보 수집/이용 동의" },
    { id: "identification", label: "고유식별정보 처리 동의" },
    { id: "telecom", label: "통신사 이용약관 동의" },
  ]
  const [consents, setConsents] = useState<Record<string, boolean>>(
    Object.fromEntries(consentItems.map((item) => [item.id, false]))
  )

  const allChecked = Object.values(consents).every(Boolean)

  const handleAllCheck = () => {
    const newValue = !allChecked
    setConsents(Object.fromEntries(Object.keys(consents).map((k) => [k, newValue])))
  }

  const handleItemCheck = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNext = () => {
    router.push("/goal/account/create/auth")
  }

  return (
    <div className="flex flex-col px-[24px]">
      {/* 타이틀 */}
      <div className="mt-[43px] mb-[26px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"휴대폰 본인확인을 위해\n필수사항에 동의해 주세요"}
        </h1>
      </div>

      {/* 전체 동의 */}
      <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px] flex-1">
            <button onClick={handleAllCheck} className="w-[24px] h-[24px] flex items-center justify-center">
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
            <span className="text-head-06 text-neutral-1">휴대폰 본인확인 약관</span>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)}>
            <Image
              src="/icons/arrow-down.png"
              alt="토글"
              width={24}
              height={24}
              className={`${isExpanded ? "rotate-0" : "rotate-180"}`}
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
                    src={consents[item.id] ? "/icons/check-green.png" : "/icons/check.png"}
                    alt="체크"
                    width={24}
                    height={24}
                  />
                </button>
                <span className="text-body-02">{item.label}</span>
              </div>
              <Image src="/icons/arrow-right.png" alt="보기" width={24} height={24} />
            </div>
          ))}
        </div>
      )}

      {/* 버튼 */}
      <div
        className={`flex flex-col gap-5 items-center mb-[56px] ${isExpanded ? "mt-[221px]" : "mt-[402px]"
          }`}
      >
        {allChecked ? (
          <BigButtonActivated label="동의하고 진행하기" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="동의하고 진행하기" onClick={() => { }} />
        )}
      </div>
    </div>
  )
}
