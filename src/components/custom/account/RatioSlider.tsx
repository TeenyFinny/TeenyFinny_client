"use client"

import type React from "react"

interface RatioSliderProps {
  /** 총 금액 (원) */
  totalAmount: number
  /** 투자 비율 (0~100) */
  investmentRatio: number
  /** 비율이 변경될 때 호출: 0~100 숫자 하나만 전달 */
  onChange: (ratio: number) => void
}

/**
 * RatioSlider
 *
 * - 부모와는 **비율(0~100)** 만 주고받음
 * - 슬라이더 내부에서만 `totalAmount`를 이용해 금액을 계산해서 표시
 */
export function RatioSlider({
  totalAmount,
  investmentRatio,
  onChange,
}: RatioSliderProps) {
  // 비율은 부모가 관리하는 값 (controlled component)
  const clampedInvestmentRatio = Math.min(100, Math.max(0, investmentRatio))
  const allowanceRatio = 100 - clampedInvestmentRatio

  const safeTotal = Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : 0

  const investmentAmount = Math.round((safeTotal * clampedInvestmentRatio) / 100)
  const allowanceAmount = safeTotal - investmentAmount

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextRatio = Number(e.target.value)
    onChange(nextRatio)
  }

  const formatAmount = (amount: number): string =>
    `${amount.toLocaleString("ko-KR")}원`

  return (
    <div className="w-[329px] h-[72px] space-y-4">
      {/* 상단 레이블 영역 */}
      <div className="flex items-center justify-between">
        <span>
          <span className="text-body-06 text-error">
            투자 비율
          </span>
          <span className="text-body-08 text-neutral-4 ml-[5px]">
            {formatAmount(investmentAmount)}
          </span>
        </span>
        <span>
          <span className="text-body-08 text-neutral-4">
            {formatAmount(allowanceAmount)}
          </span>
          <span className="text-body-06 text-info ml-[5px]">
            용돈 비율
          </span>
        </span>
      </div>

      {/* 슬라이더 영역 */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={clampedInvestmentRatio}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[#cacaca] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#1761c5]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#1761c5]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* 하단 퍼센트 표시 */}
      <div className="flex items-center justify-between">
        <span className="text-head-03 text-[#ef4c4a] font-bold whitespace-pre-line">
          {clampedInvestmentRatio}%
        </span>
        <span className="text-head-03 text-[#1761c5] font-bold whitespace-pre-line">
          {allowanceRatio}%
        </span>
      </div>
    </div>
  )
}
