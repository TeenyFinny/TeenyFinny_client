"use client"

/**
 * TradeHistoryProps
 * @typedef {Object} TradeHistoryProps
 * @property {string} transactionName - 거래 이름입니다.
 * @property {string} time - 거래 시간입니다.
 * @property {string} Price - 거래 액수입니다.
 * @property {boolean} isDeposit - 입금일 시 true, 출금일 시 false
 */
interface TransactionHistoryProps {
  transactionName: string
  time: string
  Price: string
  isDeposit: boolean
}

export function TransactionHistory({ transactionName, time, Price, isDeposit }: TransactionHistoryProps) {
    const changeColor = isDeposit ? "#f55053" : "#0d77cf"

  return (
    <div
      className="
        relative flex h-[76px] w-[100%] items-start gap-3
        px-5 py-4
      "
    >
      {/** 인디케이터 점 */}
      <div className="h-3 w-3 rounded-full flex-shrink-0 mt-[6px]" style={{ backgroundColor: changeColor }}/>

      {/** 거래 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-head-04 text-neutral-1 whitespace-pre-line">{transactionName}</h3>
        <p className="text-body-07 text-neutral-3 whitespace-pre-line mt-[5px]">{time}</p>
      </div>

      {/** 금액 정보 */}
      <div className="flex flex-col items-end gap-[3px]">
        <p className="text-head-08 text-neutral-1 whitespace-nowrap">{Price}</p>
        <p>
          
        </p>
      </div>

      {/** Divider (inset 20px, 1px, inset -0.5 shadow) */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-neutral-5" />
    </div>
  )
}
