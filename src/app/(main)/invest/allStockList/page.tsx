"use client"
import { StockList } from "@/components/ui/invest/StockList";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    (async () => {
      try {
        const [stockRes] = await Promise.all([
          api.get(requests.stockList),
        ]);
        // const res = await api.get(requests.stockList);
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

  const handleBuy = (stockId: string) => {
    router.push(`/invest/buyStock?id=${stockId}`)
  }
  return (
    <div className="w-full bg-primary-4 pb-20">
      <div className="flex justify-center items-center gap-2 pt-4 pb-7">
        <h2 className="text-head-06 text-neutral-1">전체 주식 목록</h2>
        <img src="/icons/refresh.png" alt="새로고침" className="w-5 h-5" />
      </div>
      <StockList stocks={stocks} onClickBtn={handleBuy} btnLab="사기"/>
    </div>
  )
}