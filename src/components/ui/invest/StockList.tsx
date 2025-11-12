"use client"

import { TinyButton } from "../button/TinyButton"


interface Stock {
  id: string
  name: string
  code: string
  price: string
  changePercent: string
  isPositive: boolean
}

interface StockListProps {
  stocks: Stock[]
  onClickBtn?: (stockId: string) => void
  onClickRow?: (stockId: string) => void
  btnLab?: string
}

export function StockList({ stocks, onClickBtn, onClickRow, btnLab="팔기" }: StockListProps) {
  return (
    <div className="w-[376px] h-[267px] flex flex-col">
      <div className="flex items-center justify-between px-[16px] pt-[18px] pb-[12px]">
        <div className="text-neutral-2 text-body-07">종목명</div>
        <div className="text-neutral-2 text-body-07">평균단가</div>
      </div>

      <div className="flex flex-col">
        {stocks.map((stock, index) => (
          <div key={stock.id}>
            <div className="flex items-center justify-between px-[16px] py-[12px]">
              {/* Left Side - Stock Info */}
              <div className="flex gap-[8px]" onClick={() => onClickRow?.(stock.id)}>
                <div className={`w-[12px] h-[12px] rounded-full flex-shrink-0 translate-y-[6px] ${stock.isPositive ? "bg-error" : "bg-primary-1"}`} />
                <div className="flex flex-col gap-[4px]">
                  <h3 className="text-head-04 text-neutral-1">{stock.name}</h3>
                  <p className="text-body-07 text-neutral-3">거래량 {stock.code}</p>
                </div>
              </div>

              {/* Right Side - Price and Action */}
              <div className="flex items-center gap-[12px]">
                <div className="flex flex-col items-end gap-[4px]">
                  <p className="text-head-04 text-neutral-1">{stock.price} 원</p>
                  <p className={`text-body-08 ${stock.isPositive ? "text-error" : "text-primary-1"}`}>{stock.changePercent}% {stock.isPositive ? "↑" : "↓"}</p>
                </div>
                <TinyButton label={btnLab} onClick={() => onClickBtn?.(stock.id)} />
              </div>
            </div>
            {index < stocks.length - 1 && <div className="mx-[16px] h-[1px] bg-monochrome-gray" />}
          </div>
        ))}
      </div>
    </div>
  )
}
