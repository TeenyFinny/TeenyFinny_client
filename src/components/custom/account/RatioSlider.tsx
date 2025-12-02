"use client"

import type React from "react"

interface RatioSliderProps {
  /**
   * 총 금액(원 단위, 정수)
   *
   * - 0보다 작거나 NaN/Infinity인 경우 내부에서 0으로 처리된다.
   * - 이 값은 **표시용(투자/용돈 금액 계산)** 으로만 사용되고,
   *   비율 상태는 부모가 별도로 관리한다.
   */
  totalAmount: number
  /**
   * 투자 비율 (0~100)
   *
   * - 부모 컴포넌트에서 관리하는 **controlled value**
   * - 컴포넌트 내부에서 0~100 범위로 클램핑(clamp)된다.
   */
  investmentRatio: number
  /**
   * 비율 변경 콜백
   *
   * - 사용자 슬라이더 조작 시 호출된다.
   * - 0~100 범위의 정수 비율 값만 전달된다.
   */
  onChange: (ratio: number) => void
  /**
   * 비활성화 여부
   *
   * - true일 경우:
   *   - 슬라이더 조작이 막히고, 포인터 커서가 disabled 스타일로 바뀐다.
   *   - `onChange` 콜백은 호출되지 않는다.
   */
  disabled: boolean
}

/**
 * RatioSlider
 *
 * 자동이체 금액 중에서 "투자 비율"과 "용돈 비율"을 시각적으로 조절/표시하는 슬라이더 컴포넌트.
 *
 * ### 특징
 * - **Controlled Component**
 *   - 비율 값(`investmentRatio`)은 항상 부모에서 관리한다.
 *   - 내부에서 슬라이더를 조작하면 `onChange(ratio)`로 부모에 알린다.
 *
 * - **금액 계산**
 *   - `totalAmount`와 현재 투자 비율을 기반으로:
 *     - 투자 금액 = `totalAmount * (investmentRatio / 100)`
 *     - 용돈 금액 = `totalAmount - 투자 금액`
 *   - `totalAmount`가 0 이하이거나 유효하지 않으면 0으로 간주한다.
 *
 * - **비활성화 처리**
 *   - `disabled`가 true일 경우:
 *     - 슬라이더 input에 `disabled` 속성이 적용된다.
 *     - `handleSliderChange`에서 조기 리턴하여 `onChange`가 호출되지 않는다.
 */
export function RatioSlider({
  totalAmount,
  investmentRatio,
  onChange,
  disabled,
}: RatioSliderProps) {
  // 부모가 준 비율 값을 0~100 범위로 클램핑
  const clampedInvestmentRatio = Math.min(100, Math.max(0, investmentRatio))
  const allowanceRatio = 100 - clampedInvestmentRatio

  // 유효하지 않은 totalAmount(음수, NaN, Infinity 등)는 0으로 처리
  const safeTotal =
    Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : 0

  const investmentAmount = Math.round((safeTotal * clampedInvestmentRatio) / 100)
  const allowanceAmount = safeTotal - investmentAmount

  /**
   * 슬라이더 변경 이벤트 핸들러
   *
   * - disabled 상태에서는 아무 동작도 하지 않는다.
   * - 유효한 숫자로 파싱 후, `onChange`에 비율(0~100)을 전달한다.
   */
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const nextRatio = Number(e.target.value)
    onChange(nextRatio)
  }

  /** 금액 표시용 포맷터 (ex: 10000 → "10,000원") */
  const formatAmount = (amount: number): string =>
    `${amount.toLocaleString("ko-KR")}원`

  // disabled 여부에 따라 슬라이더 스타일 분기
  const sliderClassName = disabled
    ? `w-full h-2 bg-[#e0e0e0] rounded-full appearance-none cursor-not-allowed
       [&::-webkit-slider-thumb]:appearance-none
       [&::-webkit-slider-thumb]:w-6
       [&::-webkit-slider-thumb]:h-6
       [&::-webkit-slider-thumb]:rounded-full
       [&::-webkit-slider-thumb]:bg-[#bdbdbd]
       [&::-webkit-slider-thumb]:cursor-not-allowed
       [&::-moz-range-thumb]:w-6
       [&::-moz-range-thumb]:h-6
       [&::-moz-range-thumb]:rounded-full
       [&::-moz-range-thumb]:bg-[#bdbdbd]
       [&::-moz-range-thumb]:border-0
       [&::-moz-range-thumb]:cursor-not-allowed`
    : `w-full h-2 bg-[#cacaca] rounded-full appearance-none cursor-pointer
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
       [&::-moz-range-thumb]:cursor-pointer`

  return (
    <div className="w-[329px] h-[72px] space-y-4">
      {/* 상단 레이블 영역: 용돈/투자 금액 표시 */}
      <div className="flex items-center justify-between">
        <span>
          <span className="text-body-06 text-info">용돈 비율</span>
          <span className="text-body-08 text-neutral-4 ml-[5px]">
            {formatAmount(allowanceAmount)}
          </span>
        </span>
        <span>
          <span className="text-body-08 text-neutral-4">
            {formatAmount(investmentAmount)}
          </span>
          <span className="text-body-06 text-error ml-[5px]">투자 비율</span>
        </span>
      </div>

      {/* 슬라이더 영역 */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={clampedInvestmentRatio}
          onChange={handleSliderChange}
          disabled={disabled}
          className={sliderClassName}
        />
      </div>

      {/* 하단 퍼센트 표시 (용돈/투자 비율 %) */}
      <div className="flex items-center justify-between">
        <span className="text-head-03 text-info font-bold whitespace-pre-line">
          {allowanceRatio}%
        </span>
        <span className="text-head-03 text-error font-bold whitespace-pre-line">
          {clampedInvestmentRatio}%
        </span>
      </div>
    </div>
  )
}
