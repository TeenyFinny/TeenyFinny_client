"use client"

import { TinyButton } from "../button/TinyButton"


interface Stock {
  inter_shrn_iscd: string // 종목코드
  inter_kor_isnm: string, // 종목명
  inter2_prpr: string, // 현재가
  inter2_prdy_vrss: string, // 전일 대비 가격
  prdy_ctrt: string, // 전일 대비 등락률(%)
  acml_vol: string, // 누적 거래량
}

interface StockListProps {
  stocks: Stock[]
  onClickBtn?: (stockId: string) => void
  onClickRow?: (stockId: string) => void
  btnLab?: string
}

export function StockList({ stocks, onClickBtn, onClickRow, btnLab = "팔기" }: StockListProps) {
  return (
    <div className="w-[376px] h-[267px] flex flex-col">
      <div className="flex items-center justify-between px-[16px] pt-[18px] pb-[12px]">
        <div className="text-neutral-2 text-body-07">종목명</div>
        <div className="text-neutral-2 text-body-07">현재가</div>
      </div>

      <div className="flex flex-col">
        {stocks.map((stock, index) => {
          const isPositive = parseFloat(stock.inter2_prdy_vrss.replace(/,/g, "")) > 0;
          const isZero = parseFloat(stock.inter2_prdy_vrss.replace(/,/g, "")) === 0;
          const colorClass = isPositive ? "text-error" : isZero ? "text-neutral-1" : "text-primary-1";
          const bgClass = isPositive ? "bg-error" : isZero ? "bg-neutral-1" : "bg-primary-1";
          const arrow = isPositive ? "↑" : isZero ? "-" : "↓";

          return (
            <div key={stock.inter_shrn_iscd}>
              <div className="flex items-center justify-between px-[16px] py-[12px]">
                {/* Left Side - Stock Info */}
                <div className="flex gap-[8px]" onClick={() => onClickRow?.(stock.inter_shrn_iscd)}>
                  <div className={`w-[12px] h-[12px] rounded-full flex-shrink-0 translate-y-[6px] ${bgClass}`} />
                  <div className="flex flex-col gap-[4px]">
                    <h3 className="text-head-04 text-neutral-1">{stock.inter_kor_isnm}</h3>
                    <p className="text-body-07 text-neutral-3">거래량 {stock.acml_vol}</p>
                  </div>
                </div>

                {/* Right Side - Price and Action */}
                <div className="flex items-center gap-[12px]">
                  <div className="flex flex-col items-end gap-[4px]">
                    <p className="text-head-04 text-neutral-1">{stock.inter2_prpr} 원</p>
                    <p className={`text-body-08 ${colorClass}`}>{stock.prdy_ctrt}% {arrow}</p>
                  </div>
                  <TinyButton label={btnLab} onClick={() => onClickBtn?.(stock.inter_shrn_iscd)} />
                </div>
              </div>
              {index < stocks.length - 1 && <div className="mx-[16px] h-[1px] bg-monochrome-gray" />}
            </div>
          );
        })}
      </div>
    </div>
  )
}
