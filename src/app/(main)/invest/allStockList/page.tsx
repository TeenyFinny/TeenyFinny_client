"use client"
import { StockList } from "@/components/ui/invest/StockList";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";

import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { BottomSheetBuyStock } from "@/components/ui/bottom-sheet/BottomSheetBuyStock";


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
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null)

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
    <div className="w-full bg-primary-4 pb-20">
      <div className="flex justify-center items-center gap-2 pt-4 pb-7">
        <h2 className="text-head-06 text-neutral-1">전체 주식 목록</h2>
        <img src="/icons/refresh.png" alt="새로고침" className="w-5 h-5" />
      </div>
      <StockList stocks={stocks} 
                  onClickBtn={handleStockDetail} 
                  btnLab="사기" 
                  onClickRow={(id) => {
                    router.push(`/invest/stockDetail?id=${id}`)
                  }}
                  />


      {/* 바텀시트 컴포넌트 */}
      {selectedStock && (
        <BottomSheetBuyStock
          open={open}
          setOpen={setOpen}
          price={Number(String(selectedStock.price).replace(/,/g, ""))}
          availableStocks={Number(String(selectedStock.availableStocks).replace(/,/g, ""))}
          maxQuantity={selectedStock.maxQuantity}
          onConfirm={(quantity) => {
            alert(`${selectedStock.prdt_name} ${quantity}주 매수`)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  )
}