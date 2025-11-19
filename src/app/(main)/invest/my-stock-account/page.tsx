"use client"
import { InvestStatus } from "@/components/ui/invest/InvestStatus";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";


interface Stock {
  // stck_shrn_iscd: string // 종목코드
  // hts_kor_isnm: string, // 종목명
  // stck_prpr: string, // 현재가
  // prdy_vrss: string, // 전일 대비 가격
  // prdy_ctrt: string, // 전일 대비 등락률(%)
  // acml_vol: string, // 누적 거래량
  // prdy_vrss_sign: string, // 등락 구분 (1: 상승, 2: 상한, 3: 보합, 4: 하한, 5: 하락)
  pdno:string
  prdtName: string,
  hldgQty: string,
  pchsAvgPric: string,
  profitRate: string,
  isPositive: boolean
}


interface InvestSummary {
  sctsEvluAmt: string;
  profitAmount: string;
  profitRate: string;
  dncaTotAmt: string;
  isPositive: boolean;
}


export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [investSummary, setInvestSummary] = useState<InvestSummary | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    (async () => {
      try {
        const [stockRes] = await Promise.all([
          api.post(requests.myStocks),
        ]);
        // const res = await api.get(requests.stockList);
        setStocks(stockRes.data.myStocks ?? []);
        setInvestSummary(stockRes.data.summary ?? []);
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


  return (
    <main className="">
      <div className="flex flex-col items-center pt-6">
        {investSummary && <InvestStatus
            userName={"효징징징이"}
            currentAmount={investSummary.sctsEvluAmt}
            profitAmount={investSummary.profitAmount}
            profitRate={investSummary.profitRate}
            availableAmount={investSummary.dncaTotAmt}
            isPositive={investSummary.isPositive}
            />
        }
        {/* My Stocks Section */}
        <h2 className="text-head-06 text-neutral-2 px-4 pt-12 self-start">내가 산 주식</h2>
        <div className="mb-5 mt-2 w-[376px] flex flex-col">
          <div className="flex items-center justify-between px-6">
            <span className="text-body-07 text-neutral-2 mt-3">종목명</span>
            <span className="text-body-07 text-neutral-2 mt-3">평균단가</span>
          </div>
          <div className="mx-5 h-[1px] mt-[10px] bg-monochrome-gray" />
          {stocks.map((stock, index) => (
            <div key={stock.pdno} onClick={() => {
                    router.push(`/invest/stock-details?stck_shrn_iscd=${stock.pdno}&mode=buy`);
                  }}>
              <TradeHistory
                stockName={stock.prdtName}
                stockCode={`보유 수량 ${stock.hldgQty}주`}
                currentPrice={`${stock.pchsAvgPric.toLocaleString()} 원`}
                changeRate={Number(stock.profitRate)}
              />
              {/* 항목 사이 구분선 (마지막 요소 제외) */}
              {index < stocks.length - 1 && (
                <div className="mx-5 h-[1px] bg-monochrome-gray" />
              )}
            </div>
          ))}
        </div>
      </div>
      
    </main>
  )
}