"use client"
import { HttpError } from "@/types/axios/httpError.t";
import requests from "@/lib/axios/requests"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios/axios";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BottomSheetBuyStock } from "@/components/ui/bottom-sheet/BottomSheetBuyStock";
import { BottomSheetSellStock } from "@/components/ui/bottom-sheet/BottomSheetSellStock";
import { createTradeOrder } from "@/lib/api/tradeOrder";

import { PushNotification } from "@/components/ui/notice/PushNotification";

interface StockDetail {
  productCode: string;
  productName: string;
  currentPrice: number;
  prevRate: string;
  accumulatedVolume: string;
  depositAmount: number;
  maxBuyQuantity: number;
  holdingQuantity: number;
}

function StockDetailsContentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const stck_shrn_iscd = params.get("stck_shrn_iscd");
  const mode = params.get("mode");

  const [stock, setStock] = useState<StockDetail>();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // PushNotification state
  const [notiOpen, setNotiOpen] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  useEffect(() => {
    if (!stck_shrn_iscd) return;

    let intervalId: NodeJS.Timeout;

    const fetchDetail = async () => {
      try {
        const res = await api.get(requests.stockDetail(stck_shrn_iscd));
        console.log("Fetched stock detail:", res);
        const stockData = res.data;

        setStock({
          productCode: stockData.productCode,
          productName: stockData.productName,
          currentPrice: stockData.currentPrice,
          prevRate: stockData.prevRate,
          accumulatedVolume: stockData.accumulatedVolume,
          depositAmount: stockData.depositAmount,
          maxBuyQuantity: stockData.maxBuyQuantity,
          holdingQuantity: stockData.holdingQuantity,
        });

      } catch (e) {
        const err = e as HttpError;

        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    intervalId = setInterval(fetchDetail, 3000);

    return () => clearInterval(intervalId);
  }, [stck_shrn_iscd, mode, router]);

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

  /** 주문 공통 처리 (buy / sell) */
  const handleTradeOrder = async (quantity: number) => {
    if (!stock) return

    const type = mode === "buy" ? "BUY" : "SELL";
    const price = String(stock.currentPrice);

    try {
      const res = await createTradeOrder(
        stock.productCode,
        stock.productName,
        price,
        quantity,
        type
      )

      // alert(`${stock.productName} ${quantity}주 ${mode === "buy" ? "매수" : "매도"} 완료!`)
      setNotiMessage(`${res.data.productName} ${res.data.quantity}주 ${mode === "buy" ? "매수" : "매도"} 완료!`);
      setNotiOpen(true);
      console.log(`${type} 주문 결과:`, res)
    } catch (e) {
      console.error(`${mode} 주문 실패:`, e)
      // alert("주문 실패")
      setNotiMessage("주문 실패");
      setNotiOpen(true);
    } finally {
      setOpen(false)
    }
  }

  const isPositive = parseFloat(stock.prevRate.replace(/,/g, "")) > 0;
  const isZero = parseFloat(stock.prevRate.replace(/,/g, "")) === 0;
  const colorClass = isPositive ? "text-error" : isZero ? "text-neutral-1" : "text-primary-1";
  const arrowIcon = isPositive ? "icon_invest_up.png" : "icon_invest_down.png";

  return (
    <div>
      {/* Main Content */}
      <main className="px-6 pt-4 pb-32">
        {/* Category and Refresh */}
        <div className="flex items-center justify-center gap-2 mb-17">
          <span className={`${colorClass} text-head-06`}>국내주식</span>
        </div>

        {/* Stock Name */}
        <h1 className="text-center text-landing-01 text-neutral-1 mb-2">{stock.productName}</h1>

        {/* Price and Change */}
        <div className="text-center mb-5">
          <span className={`${colorClass} text-head-06 mr-2`}>{Number(stock.currentPrice).toLocaleString()}원</span>
          <span className={`${colorClass} text-head-06`}>{stock.prevRate}%</span>
        </div>

        {/* Arrow Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-47 h-40 bg-monochrome-lightgray rounded-[20px] flex items-center justify-center">
            <img src={`/images/invest/${arrowIcon}`} alt="주식 차트 이미지" className="w-30 h-32" />
          </div>
        </div>

        {/* Stats Text */}
        <div className="text-center">
          <p className="text-body-06 text-neutral-1 mb-2">
            {"어제보다 "}
            {isPositive ? " 올랐어요!" : isZero ? " 변동이 없어요." : " 내렸어요."}
          </p>
          <p className="text-body-06 text-neutral-1">지금까지 {stock.accumulatedVolume} 주 만큼 이 주식을 사고 팔았어요!</p>
        </div>

        {/* Buy Button */}
        <div className="fixed bottom-[142px] w-full max-w-[327px]">
          <BigButtonActivated label={mode === "buy" ? "주식 사기" : "주식 팔기"} onClick={() => setOpen(true)} />
        </div>
      </main>

      {/* 팔기 바텀시트 컴포넌트 */}
      {stock && mode === "sell" && (
        <BottomSheetSellStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(stock.currentPrice).replace(/,/g, ""))}
          maxQuantity={stock.maxBuyQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
      )}

      {/* 바텀시트 컴포넌트 */}
      {stock && mode === "buy" && (
        <BottomSheetBuyStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(stock.currentPrice).replace(/,/g, ""))}
          availableStocks={stock.depositAmount}
          maxQuantity={stock.holdingQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
      )}

      <PushNotification
        open={notiOpen}
        setOpen={setNotiOpen}
        message={notiMessage}
      />
    </div>
  )
}

export default function StockDetailsContent() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    }>
      <StockDetailsContentInner />
    </Suspense>
  )
}

