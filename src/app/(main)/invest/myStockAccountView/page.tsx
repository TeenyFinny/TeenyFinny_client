"use client"
import { InvestStatus } from "@/components/ui/invest/InvestStatus";
import { StockList } from "@/components/ui/invest/StockList";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [investSummary, setInvestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    (async () => {
      try {
        const [stockRes, investRes] = await Promise.all([
          api.get(requests.stockList),
          api.get(requests.investSummary),
        ]);
        // const res = await api.get(requests.stockList);
        setStocks(stockRes.data ?? []);
        setInvestSummary(investRes.data ?? []);
        console.log(investRes.data);
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

  const handleSell = (stockId: string) => {
    console.log("Selling stock:", stockId)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex  bg-primary-4">
      <div className="flex flex-col gap-12 items-center pt-6">
        <InvestStatus
            userName={investSummary.userName}
            currentAmount={investSummary.currentAmount}
            profitAmount={investSummary.profitAmount}
            profitRate={investSummary.profitRate}
            availableAmount={investSummary.availableAmount}
            />
        
        <StockList stocks={stocks} onSell={handleSell} btnLab="사기"/>
      </div>
    </main>
  )
}