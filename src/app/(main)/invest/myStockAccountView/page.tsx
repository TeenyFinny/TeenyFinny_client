"use client"
import { InvestStatus } from "@/components/ui/invest/InvestStatus";
import { StockList } from "@/components/ui/invest/StockList";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { BottomSheetSellStock } from "@/components/ui/bottom-sheet/BottomSheetSellStock";
import { createTradeOrder } from "@/lib/api/tradeOrder";


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


interface StockDetail {
  stck_shrn_iscd: string
  hts_kor_isnm: string
  stck_prpr: string
  availableStocks: number
  maxQuantity: number
}



export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [investSummary, setInvestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null)


  useEffect(() => {

    (async () => {
      try {
        const [stockRes, investRes] = await Promise.all([
          api.get(requests.koreainvestmentStockList),
          api.get(requests.investSummary),
        ]);
        // const res = await api.get(requests.stockList);
        setStocks(stockRes.output ?? []);
        setInvestSummary(investRes.data ?? []);
      } catch (e) {
	      // 커스텀 에러관리
        const err = e as HttpError;
        
        // 403일 경우 에러메시지를 반환하고 홈으로 라우팅
        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          // 필요 시 다른 에러 처리
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  /** 주문 공통 처리 (SELL) */
    const handleTradeOrder = async (quantity: number, totalPrice?: number) => {
      if (!selectedStock) return
  
      const type = "SELL";
      const price = selectedStock.stck_prpr;
  
      try {
        const res = await createTradeOrder(
          selectedStock.stck_shrn_iscd,
          selectedStock.hts_kor_isnm,
          price,
          quantity,
          type
        )
  
        alert(`${selectedStock.hts_kor_isnm} ${quantity}주 매도 완료!`)
        console.log(`${type} 주문 결과:`, res)
      } catch (e) {
        console.error(`SELL 주문 실패:`, e)
        alert("주문 실패")
      } finally {
        setOpen(false)
      }
    }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  const handleStockDetail = async (stck_shrn_iscd: string) => {
    try {
      const res = await api.get(`${requests.koreainvestmentStockDetail}?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stck_shrn_iscd}`)
      const stock = res.output
      setSelectedStock({
        stck_shrn_iscd: stock.stck_shrn_iscd,
        hts_kor_isnm: stock.hts_kor_isnm,
        stck_prpr: stock.stck_prpr,
        availableStocks: stock.availableStocks,
        maxQuantity: stock.maxQuantity,

      })
      console.log(stock);
      setOpen(true)
    } catch (e) {
      const err = e as HttpError
      alert(`주식 정보를 불러오지 못했습니다: ${err.message}`)
    }
  }



  return (
    <main className="min-h-screen flex bg-primary-4">
      <div className="flex flex-col items-center pt-6">
        {investSummary && <InvestStatus
            userName={investSummary.userName}
            currentAmount={investSummary.currentAmount}
            profitAmount={investSummary.profitAmount}
            profitRate={investSummary.profitRate}
            availableAmount={investSummary.availableAmount}
            isPositive={investSummary.isPositive}
            />
        }
        <h2 className="text-head-06 text-neutral-2 px-4 pt-12 self-start">
          내가 산 주식
        </h2>
        <StockList stocks={stocks} 
        onClickBtn={handleStockDetail} 
        btnLab="팔기"
        onClickRow={(stck_shrn_iscd) => {
                    router.push(`/invest/stockDetail?stck_shrn_iscd=${stck_shrn_iscd}&mode=SELL`);
                  }}
                  />
      </div>

      {/* 팔기 바텀시트 컴포넌트 */}
      {selectedStock && (
        <BottomSheetSellStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(selectedStock.stck_prpr).replace(/,/g, ""))}
          maxQuantity={selectedStock.maxQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
      )}
    </main>
  )
}