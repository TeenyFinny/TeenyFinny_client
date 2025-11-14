"use client"
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";
import InvestStatusWithChart from "@/components/ui/invest/InvestStatusWithChart";

interface PortfolioData {
  id: string
  prdt_name: string
  pdno: string // 보유 종목 코드
  hldg_qty: number // 보유 수량
  pchs_avg_price: number // 평균 매입 단가
}


interface InvestStatusProps {
  userName: string
  currentAmount: string
  profitAmount: string
  profitRate: string
  availableAmount: string
  isPositive: boolean
}

interface Stock {
  id: string
  name: string
  code: string
  price: number
  changePercent: number
}

export default function Page() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData>();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [investSummary, setInvestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    (async () => {
      try {
        const [portfolioRes, investRes, stockRes] = await Promise.all([
          api.get(requests.portfolio),
          api.get(requests.investSummary),
          api.get(requests.stockList),
        ]);
        // const res = await api.get(requests.stockList);
        setPortfolio(portfolioRes.data ?? []);
        setInvestSummary(investRes.data ?? []);
        setStocks(stockRes.data ?? []);
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
    <div className="px-[18px]">
      {/* <div className="flex flex-col items-center pt-6 pb-8"> */}
        <InvestStatusWithChart
          userName="민트"
          currentAmount={investSummary.currentAmount}
          profitAmount={investSummary.profitAmount}
          profitRate={investSummary.profitRate}
          availableAmount={investSummary.availableAmount}
          isPositive={investSummary.isPositive}
        />
        
        
      {/* </div> */}
      {/* My Stocks Section */}
        <div className="mb-5 w-[340px] mt-12 bg-white rounded-[16px] shadow-lg">
          <h2 className="text-head-06 text-neutral-2 px-5 pt-4 self-start">내가 산 주식</h2>
          <div className="mx-5 h-[1px] mt-[10px] bg-monochrome-gray" />
            {stocks.map((stock, index) => (
              <div key={stock.id}>
                <TradeHistory
                  stockName={stock.name}
                  stockCode={`거래량 ${stock.code}`}
                  currentPrice={`${stock.price.toLocaleString()} 원`}
                  changeRate={stock.changePercent}
                />

                {/* 항목 사이 구분선 (마지막 요소 제외) */}
                {index < stocks.length - 1 && (
                  <div className="mx-5 h-[1px] bg-monochrome-gray" />
                  )}
              </div>
            ))}
        </div>
      
    </div>
  )
}