"use client"

import { DonutChart } from "./DonutChart"

interface StockHolding {
  name: string;
  percentage: number;
}


interface PortfolioDashboardData {
  userName: string
  currentAmount: string
  profitAmount: string
  profitRate: string
  availableAmount: string
  isPositive: boolean
  holdings: StockHolding[]
}

export default function InvestStatusWithChart({
  userName,
  currentAmount,
  profitAmount,
  profitRate,
  availableAmount,
  isPositive,
  holdings,
} : PortfolioDashboardData) {
  console.log("Holdings data in InvestStatusWithChart:", holdings);
  return (
    <div>
      {/* Top Summary Card */}
      <div className="bg-white rounded-3xl mt-6 p-6 shadow-lg">
        <div className="flex items-start">
          {/* Left: Investment Summary */}
          <div className="flex-1 w-[45%]">
            <p className="text-body-06 text-neutral-1 mb-2">
              {userName}의
              <br />총 투자 현황입니다.
            </p>
            <div className="mb-2">
              <span className="text-landing-01 text-neutral-1">{currentAmount}</span>
              <span className="text-body-06 text-neutral-1 ml-1">원</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-body-07 text-error">↑</span>
              <span className="text-body-07 text-error">
                {profitAmount}원 ({profitRate}%)
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-monochrome-gray">
              <p className="text-body-06 text-neutral-1 mb-1">투자 가능한 금액</p>
              <div>
                <span className="text-landing-01 text-neutral-1">{availableAmount}</span>
                <span className="text-body-06 text-neutral-1 ml-1">원</span>
              </div>
            </div>
          </div>

          {/* Right: Donut Chart */}
          <div className="flex-shrink-0 w-[55%] translate-y-[10%]">
            <DonutChart data={holdings} size={176} innerRadius={20} outerRadius={75} />
          </div>
        </div>
      </div>
    </div>
  )
}
