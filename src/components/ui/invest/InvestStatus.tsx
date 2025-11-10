"use client"

interface InvestStatusProps {
  userName: string
  currentAmount: number
  profitAmount: number
  profitRate: number
  availableAmount: number
}

export function InvestStatus({
  userName,
  currentAmount,
  profitAmount,
  profitRate,
  availableAmount,
}: InvestStatusProps) {
  const isPositive = profitAmount >= 0

  return (
    <div className="w-[340px] h-[232px] p-6 bg-white rounded-[16px]">
      {/* Title Section */}
      <div className="">
        <h2 className="text-head-06 text-neutral-1 mb-1">{userName}의</h2>
        <p className="text-body-07 text-neutral-2">총 투자 현황입니다.</p>
      </div>

      {/* Current Amount */}
      <div className="mb-1">
        <p className="text-[32px] font-bold text-neutral-1 leading-none tracking-tight">
          {currentAmount} <span className="text-body-07 font-normal">원</span>
        </p>
      </div>

      {/* Change Amount */}
      <div className="mb-6">
        <p className={`text-body-07 ${isPositive ? "text-error" : "text-primary-1"}`}>
          {isPositive ? "↑" : "↓"} {Math.abs(profitAmount).toLocaleString("ko-KR")}원 (
          {profitRate}%)
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-monochrome-gray mb-6" />

      {/* Available Investment Section */}
      <div>
        <p className="text-body-07 text-neutral-2">투자 가능한 금액</p>
        <p className="text-[32px] font-bold text-neutral-1 leading-none tracking-tight">
          {availableAmount} <span className="text-body-07 font-normal">원</span>
        </p>
      </div>
    </div>
  )
}
