"use client"

import { TinyButton } from "../button/TinyButton"


interface Stock {
  stck_shrn_iscd: string // 종목코드
  hts_kor_isnm: string, // 종목명
  stck_prpr: string, // 현재가
  prdy_vrss: string, // 전일 대비 가격
  prdy_ctrt: string, // 전일 대비 등락률(%)
  acml_vol: string, // 누적 거래량
  prdy_vrss_sign: string, // 등락 구분 (1: 상승, 2: 상한, 3: 보합, 4: 하한, 5: 하락)
  // kospi_kosdaq_cls_name: string // 시장구분 (코스피, 코스닥)
  // acml_tr_pbmn: string, // 누적 거래대금
  // stck_oprc: string, // 시가
  // stck_hgpr: string, // 고가
  // stck_lwpr: string, // 저가
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
          <div key={stock.stck_shrn_iscd}>
            <div className="flex items-center justify-between px-[16px] py-[12px]">
              {/* Left Side - Stock Info */}
              <div className="flex gap-[8px]" onClick={() => onClickRow?.(stock.stck_shrn_iscd)}>
                <div className={`w-[12px] h-[12px] rounded-full flex-shrink-0 translate-y-[6px] ${Number(stock.prdy_vrss_sign) < 3 ? "bg-error" : "bg-primary-1"}`} />
                <div className="flex flex-col gap-[4px]">
                  <h3 className="text-head-04 text-neutral-1">{stock.hts_kor_isnm}</h3>
                  <p className="text-body-07 text-neutral-3">거래량 {stock.acml_vol}</p>
                </div>
              </div>

              {/* Right Side - Price and Action */}
              <div className="flex items-center gap-[12px]">
                <div className="flex flex-col items-end gap-[4px]">
                  <p className="text-head-04 text-neutral-1">{stock.stck_prpr} 원</p>
                  <p className={`text-body-08 ${Number(stock.prdy_vrss_sign) < 3 ? "text-error" : "text-primary-1"}`}>{stock.prdy_ctrt}% {Number(stock.prdy_vrss_sign) < 3 ? "↑" : "↓"}</p>
                </div>
                <TinyButton label={btnLab} onClick={() => onClickBtn?.(stock.stck_shrn_iscd)} />
              </div>
            </div>
            {index < stocks.length - 1 && <div className="mx-[16px] h-[1px] bg-monochrome-gray" />}
          </div>
        ))}
      </div>
    </div>
  )
}
