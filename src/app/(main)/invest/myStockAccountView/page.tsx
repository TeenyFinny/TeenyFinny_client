"use client"
import { InvestStatus } from "@/components/ui/invest/InvestStatus";
import { StockList } from "@/components/ui/invest/StockList";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { BottomSheetSellStock } from "@/components/ui/bottom-sheet/BottomSheetSellStock";

interface StockDetail {
  id: string
  prdt_name: string
  price: string
  availableStocks: number
  maxQuantity: number
}



export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [investSummary, setInvestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null)

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

  const handleStockDetail = async (stockId: string) => {
    try {
      const res = await api.get(`${requests.stockDetail}?id=${stockId}`)
      const stock = res.data
      setSelectedStock({
        id: stock.id,
        prdt_name: stock.prdt_name,
        price: stock.price,
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
        <StockList stocks={stocks} onClickBtn={handleStockDetail} btnLab="팔기"/>
      </div>

      {/* 팔기 바텀시트 컴포넌트 */}
      {selectedStock && (
        <BottomSheetSellStock
          open={open}
          setOpen={setOpen}
          price={Number(String(selectedStock.price).replace(/,/g, ""))}
          maxQuantity={selectedStock.maxQuantity}
          onConfirm={(quantity, totalPrice) => {
            alert(`${quantity}주 판매 (${totalPrice}원)`);
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </main>
  )
}