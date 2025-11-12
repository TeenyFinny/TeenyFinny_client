"use client"
import { HttpError } from "@/types/axios/httpError.t";
import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios/axios";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BottomSheetBuyStock } from "@/components/ui/bottom-sheet/BottomSheetBuyStock";


export default function Page(){
  const router = useRouter();
  const params = useSearchParams();
  const stockId = params.get("id");

  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!stockId) return;
    (async () => {
      try {
        const res = await api.get(`${requests.stockDetail}?id=${stockId}`);
        setStock(res.data);
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
  }, [stockId]);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }
  if (!stock) {
    return (
      <div className="flex justify-center items-center h-screen text-neutral-1">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      {/* Main Content */}
      <main className="px-6 pt-4 pb-32">
        {/* Category and Refresh */}
        <div className="flex items-center justify-center gap-2 mb-17">
          <span className={`${stock.isPositive ? "text-error" : "text-primary-1"} text-head-06`}>{stock.category_name}</span>
          <img src="/icons/refresh.png" alt="새로고침 아이콘"className="w-5 h-5" />
        </div>

        {/* Stock Name */}
        <h1 className="text-center text-landing-01 text-neutral-1 mb-2">{stock.name}</h1>

        {/* Price and Change */}
        <div className="text-center mb-5">
          <span className={`${stock.isPositive ? "text-error" : "text-primary-1"} text-head-06 mr-2`}>{stock.price}원</span>
          <span className={`${stock.isPositive ? "text-error" : "text-primary-1"} text-head-06`}>{stock.changePercent}%</span>
        </div>

        {/* Arrow Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-47 h-40 bg-monochrome-lightgray rounded-[20px] flex items-center justify-center">
            <img src={`/images/invest/${stock.isPositive ? "icon_invest_up.png" : "icon_invest_down.png"}`} alt="주식 차트 이미지" className="w-30 h-32"/>
          </div>
        </div>

        {/* Stats Text */}
        <div className="text-center">
          <p className="text-body-06 text-neutral-1 mb-2">
            {"어제보다 "}
            <span className={`${stock.isPositive ? "text-error" : "text-primary-1"} text-head-03`}>{stock.prevDayPriceChange}원</span>
            {" 올랐어요!"}
          </p>
          <p className="text-body-06 text-neutral-1">어제는 {stock.prevDayVolume}명이 이 주식을 사고 팔았어요!</p>
        </div>

        {/* Info Box */}
        <div className="rounded-[10px] px-6 py-4 mt-18">
          <p className="text-body-08 text-neutral-4 text-center">새로고침 시 변동 가격이 반영됩니다.</p>
        </div>

        {/* Buy Button */}
        <div className="mt-1">
          <BigButtonActivated label="주식 사기" onClick={() => setOpen(true)} />
        </div>
      </main>

      {/* 바텀시트 컴포넌트 */}
      <BottomSheetBuyStock
        open={open}
        setOpen={setOpen}
        price={Number(String(stock.price).replace(/,/g, ""))}
        availableStocks={1000000}
        maxQuantity={20}
        onConfirm={(quantity) => {
          console.log(`${stock.name} ${quantity}주 매수 (${quantity * stock.price}원)`)
          setOpen(false)
        }}
        onCancel={() => setOpen(false)}
      />

    </div>
  )
}
