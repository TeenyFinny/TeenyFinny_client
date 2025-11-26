"use client"
import { StockList } from "@/components/ui/invest/StockList";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { BottomSheetBuyStock } from "@/components/ui/bottom-sheet/BottomSheetBuyStock";
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

  const searchParams = useSearchParams();

  // "mode" 값 받아오기 ("buy" or "sell")
  const mode = searchParams.get("mode") ?? "buy";


  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null);

  useEffect(() => {

    (async () => {
      try {
        const [stockRes] = await Promise.all([
          api.get(requests.koreainvestmentStockList),
        ]);
        // const res = await api.get(requests.stockList);
        setStocks((stockRes as any).output ?? []);
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
      const stock = (res as any).output
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

  /** 주문 공통 처리 (buy / sell) */
  const handleTradeOrder = async (quantity: number, totalPrice?: number) => {
    if (!selectedStock) return

    const type = mode === "buy" ? "BUY" : "SELL";
    const price = selectedStock.stck_prpr;

    try {
      const res = await createTradeOrder(
        selectedStock.stck_shrn_iscd,
        selectedStock.hts_kor_isnm,
        price,
        quantity,
        type
      )

      alert(`${selectedStock.hts_kor_isnm} ${quantity}주 ${mode === "buy" ? "매수" : "매도"} 완료!`)
      console.log(`${type} 주문 결과:`, res)
    } catch (e) {
      console.error(`${mode} 주문 실패:`, e)
      alert("주문 실패")
    } finally {
      setOpen(false)
    }
  }
  
  return (
    <div className="w-full bg-primary-4 pb-20">
      <div className="flex justify-center items-center gap-2 pt-4 pb-7">
        <h2 className="text-head-06 text-neutral-1">전체 주식 목록</h2>
        <img src="/icons/refresh.png" alt="새로고침" className="w-5 h-5" />
      </div>
      <StockList stocks={stocks} 
                  onClickBtn={handleStockDetail} 
                  btnLab={mode === "buy" ? "사기" : "팔기"}
                  onClickRow={(stck_shrn_iscd) => {
                    router.push(`/invest/stock-details?stck_shrn_iscd=${stck_shrn_iscd}&mode=${mode}`);
                  }}
                  />


      {/* 팔기 바텀시트 컴포넌트 */}
      {selectedStock && mode === "sell" && (
        <BottomSheetSellStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(selectedStock.stck_prpr).replace(/,/g, ""))}
          maxQuantity={selectedStock.maxQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
      )}

      {/* 사기 바텀시트 컴포넌트 */}
      {selectedStock && mode === "buy" && (
        <BottomSheetBuyStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(selectedStock.stck_prpr).replace(/,/g, ""))}
          availableStocks={Number(String(selectedStock.availableStocks).replace(/,/g, ""))}
          maxQuantity={selectedStock.maxQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  )
}