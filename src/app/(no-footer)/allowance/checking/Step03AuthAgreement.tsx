"use client"

import { useState } from "react"
import { Check, ChevronUp, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * ConsentItem
 * @typedef {Object} ConsentItem
 * @property {string} id - 동의 항목의 고유 식별자
 * @property {string} label - 동의 항목의 표시 텍스트
 */
interface ConsentItem {
  id: string
  label: string
}

/**
 * Step3Page
 *
 * 휴대폰 본인확인을 위한 필수 약관 동의 페이지입니다.
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
export default function Step3Page() {
  const router = useRouter()

  // 전체 동의 토글 열림/닫힘 상태
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  // 개별 동의 항목 체크 상태
  const [consents, setConsents] = useState<Record<string, boolean>>({
    service: false,
    privacy: false,
    identification: false,
    telecom: false,
  })

  // 동의 항목 목록
  const consentItems: ConsentItem[] = [
    { id: "service", label: "서비스 이용약관 동의" },
    { id: "privacy", label: "개인정보 수집/이용 동의" },
    { id: "identification", label: "고유식별정보처리" },
    { id: "telecom", label: "통신사 이용약관 동의" },
  ]

  // 모든 항목이 체크되었는지 확인
  const allChecked = Object.values(consents).every((checked) => checked)

  /**
   * 전체 동의 체크박스 클릭 시 모든 하위 항목을 일괄 체크/해제합니다.
   */
  const handleAllCheck = () => {
    const newValue = !allChecked
    setConsents({
      service: newValue,
      privacy: newValue,
      identification: newValue,
      telecom: newValue,
    })
  }

  /**
   * 개별 동의 항목 체크박스 클릭 시 해당 항목의 체크 상태를 토글합니다.
   *
   * @param {string} id - 동의 항목의 고유 식별자
   */
  const handleItemCheck = (id: string) => {
    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  /**
   * "동의하고 진행하기" 버튼 클릭 시 실행됩니다.
   * 모든 항목에 동의한 경우에만 다음 단계로 이동합니다.
   */
  const handleProceed = () => {
    if (allChecked) {
      // 다음 단계로 이동하는 로직
      console.log("모든 약관에 동의했습니다.")
      // router.push("/step4")
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff] px-[24px] py-[24px]">
      {/* 제목 */}
      <h1 className="text-landing-01 text-[#000000] mb-[40px] whitespace-pre-line">
        {"휴대폰 본인확인을 위해\n필수사항에 동의해 주세요"}
      </h1>

      {/* 알아서 준비해주는 서류 섹션 */}
      <section className="mb-[24px]">
        <h2 className="text-head-04 text-[#000000] mb-[16px]">알아서 준비해주는 서류</h2>
        <p className="text-body-07 text-[#000000] leading-relaxed whitespace-pre-line">
          {"필요한 서류는 스크래핑을 통해 대법원에서 자동으로 발급해주니까, "}
          <span className="text-[#0067ac]">부모님 본인 명의 휴대폰, 신분증</span>
          {"만 준비하면 빠른 개설이 가능해요"}
        </p>
      </section>

      {/* 휴대폰 본인확인 약관 - 전체 동의 */}
      <div className="mb-[16px] bg-[#e8ebee] rounded-[8px] px-[20px] py-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px] flex-1">
            {/* 전체 동의 체크박스 */}
            <button
              onClick={handleAllCheck}
              className="flex-shrink-0 w-[24px] h-[24px] rounded-full border-[2px] flex items-center justify-center transition-colors"
              style={{
                borderColor: allChecked ? "#55bb59" : "#cacaca",
                backgroundColor: allChecked ? "#55bb59" : "transparent",
              }}
            >
              {allChecked && <Check className="w-[16px] h-[16px] text-[#ffffff]" strokeWidth={3} />}
            </button>

            {/* 전체 동의 텍스트 */}
            <span className="text-head-04 text-[#000000]">휴대폰 본인확인 약관</span>
          </div>

          {/* 토글 버튼 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 text-[#898989] transition-transform"
          >
            {isExpanded ? <ChevronUp className="w-[24px] h-[24px]" /> : <ChevronDown className="w-[24px] h-[24px]" />}
          </button>
        </div>
      </div>

      {/* 개별 동의 항목 목록 */}
      {isExpanded && (
        <div className="space-y-[16px] mb-[40px]">
          {consentItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[12px] flex-1">
                {/* 개별 체크박스 */}
                <button
                  onClick={() => handleItemCheck(item.id)}
                  className="flex-shrink-0 w-[24px] h-[24px] flex items-center justify-center transition-colors"
                >
                  <Check
                    className="w-[24px] h-[24px]"
                    strokeWidth={2}
                    style={{
                      color: consents[item.id] ? "#55bb59" : "#e8ebee",
                    }}
                  />
                </button>

                {/* 항목 텍스트 */}
                <span className="text-body-06 text-[#000000]">{item.label}</span>
              </div>

              {/* 화살표 아이콘 */}
              <button className="flex-shrink-0 text-[#cacaca]">
                <ChevronDown className="w-[24px] h-[24px] -rotate-90" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 동의하고 진행하기 버튼 */}
      <button
        onClick={handleProceed}
        disabled={!allChecked}
        className="fixed bottom-[24px] left-[24px] right-[24px] rounded-[8px] py-[16px] text-body-04 font-semibold transition-all"
        style={{
          backgroundColor: allChecked ? "#0067ac" : "#e8ebee",
          color: allChecked ? "#ffffff" : "#cacaca",
        }}
      >
        동의하고 진행하기
      </button>
    </div>
  )
}
