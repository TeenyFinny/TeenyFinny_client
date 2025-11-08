"use client"

/**
 * TradeHistoryProps
 * @typedef {Object} TradeHistoryProps
 * @property {string} stockName - 종목명입니다.
 * @property {string} stockCode - 종목 코드 또는 거래량 정보입니다.
 * @property {string} currentPrice - 현재가를 표시합니다. (예: "62,500 원")
 * @property {number} changeRate - 등락률을 나타내는 숫자입니다. 양수는 상승, 음수는 하락을 의미합니다.
 */
interface TradeHistoryProps {
  stockName: string
  stockCode: string
  currentPrice: string
  changeRate: number
}

/**
 * TradeHistory
 *
 * 주식 거래 정보를 표시하는 컴포넌트입니다.
 * 종목명, 종목코드, 현재가, 등락률을 표시하며, 등락률에 따라 색상이 변경됩니다.
 *
 * ### 특징
 * - 등락률이 양수일 경우 빨간색으로 표시되며 상승 화살표(↑)가 표시됩니다.
 * - 등락률이 음수일 경우 파란색으로 표시되며 하락 화살표(↓)가 표시됩니다.
 * - 등락률의 부호는 제거되고 화살표로 방향을 표현합니다.
 * - 왼쪽에 파란색 인디케이터 점이 표시됩니다.
 *
 * ### 시각적 구성
 * - 왼쪽: 파란색 인디케이터 점
 * - 중앙 왼쪽: 종목명과 종목코드 (세로 배치)
 * - 오른쪽: 현재가와 등락률 (세로 배치, 우측 정렬)
 *
 * @component
 * @param {TradeHistoryProps} props - TradeHistory 컴포넌트 속성
 * @returns {React.ReactElement} 거래 정보를 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * <TradeHistory
 *   stockName="우리금융지주"
 *   stockCode="거래량 11200020"
 *   currentPrice="62,500 원"
 *   changeRate={57}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <TradeHistory
 *   stockName="삼성전자"
 *   stockCode="거래량 8500000"
 *   currentPrice="71,200 원"
 *   changeRate={-3.5}
 * />
 * ```
 */
export function TradeHistory({ stockName, stockCode, currentPrice, changeRate }: TradeHistoryProps) {
  /**
   * 등락률이 양수인지 음수인지 판단합니다.
   */
  const isPositive = changeRate >= 0

  /**
   * 등락률의 절댓값을 계산합니다.
   */
  const absoluteChangeRate = Math.abs(changeRate)

  /**
   * 등락률에 따른 색상을 결정합니다.
   * 양수: 빨간색 (#f55053)
   * 음수: 파란색 (#0d77cf)
   */
  const changeColor = isPositive ? "text-chart-10" : "text-chart-3"

  /**
   * 등락률에 따른 화살표를 결정합니다.
   * 양수: ↑
   * 음수: ↓
   */
  const arrow = isPositive ? "↑" : "↓"

  return (
    <div
      className="
        relative flex h-[76px] w-[100%] items-start gap-3
        px-5 py-4
      "
    >
      {/** 인디케이터 점 */}
      <div className="h-3 w-3 rounded-full flex-shrink-0 mt-[6px]" style={{ backgroundColor: changeColor }}/>

      {/** 종목 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-head-04 text-neutral-1 whitespace-pre-line">{stockName}</h3>
        <p className="text-body-07 text-neutral-3 whitespace-pre-line mt-[5px]">{stockCode}</p>
      </div>

      {/** 가격 정보 */}
      <div className="flex flex-col items-end gap-[3px]">
        <p className="text-head-08 text-neutral-1 whitespace-nowrap">{currentPrice}</p>
        <p className="text-body-05 whitespace-nowrap" style={{ color: changeColor }}>
          {absoluteChangeRate}% {arrow}
        </p>
      </div>

      {/** Divider (inset 20px, 1px, inset -0.5 shadow) */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-neutral-5" />
    </div>
  )
}
