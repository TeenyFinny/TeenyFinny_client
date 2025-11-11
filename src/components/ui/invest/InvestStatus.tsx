"use client"

interface InvestStatusProps {
  userName: string
  currentAmount: string
  profitAmount: string
  profitRate: string
  availableAmount: string
  isPositive: boolean
}

export function InvestStatus({
  userName,
  currentAmount,
  profitAmount,
  profitRate,
  availableAmount,
  isPositive,
}: InvestStatusProps) {

  return (
    <div className="w-[340px] p-6 bg-white rounded-[16px]">
      {/* Title Section */}
      <div className="">
        <h2 className="text-head-06 text-neutral-1 mb-1">{userName}의</h2>
        <p className="text-body-06 text-neutral-1">총 투자 현황입니다.</p>
      </div>

      {/* Current Amount */}
      <div>
        <p className="text-landing-01 text-neutral-1 leading-none tracking-tight">
          {currentAmount} <span className="text-body-06">원</span>
        </p>
      </div>

      {/* Change Amount */}
      <div className="mb-6">
        <p className={`text-body-07 ${isPositive ? "text-error" : "text-primary-1"}`}>
          {isPositive ? "↑" : "↓"} {profitAmount}원 (
          {profitRate}%)
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-monochrome-gray mb-6" />

      {/* Available Investment Section */}
      <div>
        <p className="text-body-07 text-neutral-1">투자 가능한 금액</p>
        <p className="text-landing-01 text-neutral-1 leading-none tracking-tight">
          {availableAmount} <span className="text-body-06">원</span>
        </p>
      </div>
    </div>
  )
}
