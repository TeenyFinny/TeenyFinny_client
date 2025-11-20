"use client"
import { HttpError } from "@/types/axios/httpError.t";
import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios/axios";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BottomSheetBuyStock } from "@/components/ui/bottom-sheet/BottomSheetBuyStock";
import { BottomSheetSellStock } from "@/components/ui/bottom-sheet/BottomSheetSellStock";
import { createTradeOrder } from "@/lib/api/tradeOrder";


interface StockDetail {
  stck_shrn_iscd: string // 종목코드
  bstp_kor_isnm: string, // 업종명
  hts_kor_isnm: string, // 종목명
  stck_prpr: string, // 현재가
  prdy_vrss: string, // 전일 대비 가격
  prdy_ctrt: string, // 전일 대비 등락률(%)
  acml_vol: string, // 누적 거래량
  prdy_vrss_sign: string, // 등락 구분 (1: 상승, 2: 상한, 3: 보합, 4: 하한, 5: 하락)
  availableStocks: number // 실제 api 데이터에는 없으나, 매수/매도 바텀시트에 필요하여 추가
  maxQuantity: number // 실제 api 데이터에는 없으나, 매수/매도 바텀시트에 필요하여 추가
}

export default function Page(){
  const router = useRouter();
  const params = useSearchParams();
  const stck_shrn_iscd = params.get("stck_shrn_iscd");
  const mode = params.get("mode");

  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!stck_shrn_iscd) return;
    (async () => {
      try {
        const res = await api.get(`${requests.koreainvestmentStockDetail}?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stck_shrn_iscd}`);
        setStock(res.output);
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
  }, [stck_shrn_iscd]);

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

// 폴링 방식
//   useEffect(() => {
//   let active = true;

//   const poll = async () => {
//     if (!active) return;

//     try {
//       const res = await api.get(
//         `${requests.koreainvestmentStockDetail}?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stck_shrn_iscd}`
//       );

//       const newData = res.output ?? null;

//       setStock((prev) => {
//         if (!prev) return newData;

//         // ---- 핵심 필드 비교 ----
//         const changed =
//           prev.stck_prpr !== newData.stck_prpr ||
//           prev.prdy_vrss !== newData.prdy_vrss ||
//           prev.prdy_ctrt !== newData.prdy_ctrt ||
//           prev.acml_vol !== newData.acml_vol;

//         return changed ? newData : prev;
//       });
//     } catch (e) {
//       console.error(e);
//     }

//     setTimeout(poll, 7000);
//   };

//   poll();

//   return () => {
//     active = false;
//   };
// }, [stck_shrn_iscd]);


  /** 주문 공통 처리 (buy / sell) */
  const handleTradeOrder = async (quantity: number, totalPrice?: number) => {
    if (!stock) return

    const type = mode === "buy" ? "BUY" : "SELL";
    const price = stock.stck_prpr;

    try {
      const res = await createTradeOrder(
        stock.stck_shrn_iscd,
        stock.hts_kor_isnm,
        price,
        quantity,
        type
      )

      alert(`${stock.hts_kor_isnm} ${quantity}주 ${mode === "buy" ? "매수" : "매도"} 완료!`)
      console.log(`${type} 주문 결과:`, res)
    } catch (e) {
      console.error(`${mode} 주문 실패:`, e)
      alert("주문 실패")
    } finally {
      setOpen(false)
    }
  }

  if (!stock) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        불러오는 중...
      </main>
    );
  }
  const isUp = Number(stock.prdy_vrss_sign) < 3;
  const priceColor = isUp ? "text-error" : "text-primary-1";
  return (
    <div>
      {/* Main Content */}
      <main className="px-6 pt-4 pb-32">
        {/* Category and Refresh */}
        <div className="flex items-center justify-center gap-2 mb-17">
          <span className={`${priceColor} text-head-06`}>{stock.bstp_kor_isnm}</span>
        </div>

        {/* Stock Name */}
        <h1 className="text-center text-landing-01 text-neutral-1 mb-2">{stock.hts_kor_isnm}</h1>

        {/* Price and Change */}
        <div className="text-center mb-5">
          <span className={`${priceColor} text-head-06 mr-2`}>{stock.stck_prpr}원</span>
          <span className={`${priceColor} text-head-06`}>{stock.prdy_ctrt}%</span>
        </div>

        {/* Arrow Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-47 h-40 bg-monochrome-lightgray rounded-[20px] flex items-center justify-center">
            <img src={`/images/invest/${isUp ? "icon_invest_up.png" : "icon_invest_down.png"}`} alt="주식 차트 이미지" className="w-30 h-32"/>
          </div>
        </div>

        {/* Stats Text */}
        <div className="text-center">
          <p className="text-body-06 text-neutral-1 mb-2">
            {"어제보다 "}
            <span className={`${priceColor} text-head-03`}>{stock.prdy_vrss}원</span>
            {isUp ? " 올랐어요!" : " 내렸어요!"}
          </p>
          <p className="text-body-06 text-neutral-1">지금까지 {stock.acml_vol}만큼 이 주식을 사고 팔았어요!</p>
        </div>

        {/* Info Box */}
        <div className="rounded-[10px] px-6 py-4 mt-18">
          <p className="text-body-08 text-neutral-4 text-center">새로고침 시 변동 가격이 반영됩니다.</p>
        </div>

        {/* Buy Button */}
        <div className="mt-1">
          <BigButtonActivated label={mode === "buy" ? "주식 사기" : "주식 팔기"} onClick={() => setOpen(true)} />
        </div>
      </main>

      {/* 팔기 바텀시트 컴포넌트 */}
      {stock && mode === "sell" && (
        <BottomSheetSellStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(stock.stck_prpr).replace(/,/g, ""))}
          maxQuantity={stock.maxQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
      )}

      {/* 바텀시트 컴포넌트 */}
      {stock && mode === "buy" && (
        <BottomSheetBuyStock
          open={open}
          setOpen={setOpen}
          stck_prpr={Number(String(stock.stck_prpr).replace(/,/g, ""))}
          availableStocks={Number(String(stock.availableStocks).replace(/,/g, ""))}
          maxQuantity={stock.maxQuantity}
          onConfirm={handleTradeOrder}
          onCancel={() => setOpen(false)}
        />
        )}

    </div>
  )
}
