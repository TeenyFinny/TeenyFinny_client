"use client"
import { HttpError } from "@/types/axios/httpError.t";
import requests from "@/lib/axios/requests"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";

export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [investSummary, setInvestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = 1 //TODO: 추후 유저ID 연동

  useEffect(() => {

    (async () => {
      try {
        const res = await api.get(`${requests.investAccount}?user_id=${userId}`);
      
        if (!res.data.hasAccount) {
          router.push("/invest/no-account");//계좌가 없다면 안내페이지로
          return;
        }

        const [stockRes] = await Promise.all([
          api.post(requests.myStocksTop3),
        ]);
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



  // unmount 검사용
  // const isMounted = useRef(true);
  // useEffect(() => {
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  // /**
  //  * Step 1 — 계좌 여부 검사
  //  */
  // useEffect(() => {
  //   const checkAccount = async () => {
  //     try {
  //       const res = await api.get(
  //         `${requests.investAccount}?user_id=${userId}`
  //       );

  //       if (!res.data?.hasAccount) {
  //         router.push("/invest/no-account");
  //         return;
  //       }

  //       // 계좌 정상 → 폴링 시작
  //       startPolling();
  //     } catch (e) {
  //       const err = e as HttpError;
  //       if (err.statusCode === 403) {
  //         alert(err.message);
  //         router.push("/");
  //       } else {
  //         console.error(err);
  //       }
  //     }
  //   };

  //   checkAccount();
  // }, [router]);

  /**
   * Step 2 — 폴링으로 3개 주식 + Summary 받아오기
   */
  // const startPolling = () => {
  //   let timer: NodeJS.Timeout;

  //   const poll = async () => {
  //     if (!isMounted.current) return;

  //     try {
  //       const res = await api.post(requests.myStocksTop3);

  //       const newStocks = res.data.myStocks ?? [];
  //       const newSummary = res.data.summary ?? [];

  //       // 데이터 변경 여부 체크 (깜빡임 방지)
  //       setStocks((prev) => {
  //         const same = JSON.stringify(prev) === JSON.stringify(newStocks);
  //         return same ? prev : newStocks;
  //       });

  //       setInvestSummary((prev: any) => {
  //         const same = JSON.stringify(prev) === JSON.stringify(newSummary);
  //         return same ? prev : newSummary;
  //       });

  //       setLoading(false);
  //     } catch (e) {
  //       console.error("폴링 오류:", e);
  //     }

  //     timer = setTimeout(poll, 7000);
  //   };

  //   poll();

  //   return () => clearTimeout(timer);
  // };

  // // 로딩 UI
  // if (loading || !investSummary) {
  //   return (
  //     <main className="min-h-screen flex justify-center items-center">
  //       로딩중...
  //     </main>
  //   );
  // }


  return (
    <div className="px-[18px]">
      {/* Investment Status */}
      <div className="w-[340px] pl-3">
        <div className="">
          <h2 className="text-body-04 text-neutral-1">{"민트"}의</h2>
          <p className="text-body-06 text-neutral-1">총 투자 현황입니다.</p>
        </div>

        {/* Current Amount */}
        <div>
          <p className="text-landing-01 text-neutral-1 leading-none tracking-tight">
            {investSummary.sctsEvluAmt} <span className="text-body-06">원</span>
          </p>
        </div>

        {/* Profit Amount */}
        <div className="mb-8 flex items-center justify-between pr-26">
          <p className={`text-body-06 ${investSummary.isPositive ? "text-error" : "text-primary-1"}`}>
            {investSummary.isPositive ? "↑" : "↓"} {investSummary.profitAmount}원 (
            {investSummary.profitRate}%)
          </p>

          {/* Account Link */}
          <a
            href="/invest/my-stock-account"
            className="flex items-center text-body-06 text-neutral-2 hover:text-neutral-1 transition-colors"
            >
            내 계좌 보기
            <img src="/icons/arrow-right.png" alt="arrow-right icon" className="w-6 h-6" />
          </a>
        </div>
      </div>



      {/* My Stocks Section */}
      <h2 className="text-head-06 text-neutral-2 px-3 self-start">내가 산 주식</h2>
      <div className="mb-5 mt-2 w-[340px] bg-white rounded-[16px] shadow-lg">
        <div className="flex items-center justify-between px-6">
          <span className="text-body-07 text-neutral-2 mt-3">종목명</span>
          <span className="text-body-07 text-neutral-2 mt-3">평균단가</span>
        </div>
        <div className="mx-5 h-[1px] mt-[10px] bg-monochrome-gray" />
        {stocks.map((stock, index) => (
          <div key={stock.pdno}>
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

      {/* Trading Buttons */}
      <div className="flex items-center justify-center gap-4 mb-5 mt-6">
        {/* buy Button */}
        <a href="/invest/all-stocks?mode=buy" className="flex flex-col items-center hover:opacity-80 transition-opacity bg-neutral-7 w-[162px] h-[120px] rounded-[16px] shadow-lg">
          <img
            src="/images/invest/illust_invest_characoin.png"
            alt="주식 사기"
            className="mb-2 mt-4"
          />
          <span className="text-head-04">
            주식 <span className="text-error">사기</span>
          </span>
        </a>

        {/* sell Button */}
        <a href="/invest/all-stocks?mode=sell" className="flex flex-col items-center hover:opacity-80 transition-opacity bg-neutral-7 w-[162px] h-[120px] rounded-[16px] shadow-lg">
          <img
            src="/images/invest/illust_invest_characoin.png"
            alt="주식 사기"
            className="mb-2 mt-4"
          />
          <span className="text-head-04">
            주식 <span className="text-primary-1">팔기</span>
          </span>
        </a>
      </div>

      {/* Investment Report Link */}
      <a
        href="/invest/portfolios"
        className="w-full py-3 px-5 mb-6 bg-neutral-7 border border-monochrome-gray rounded-[20px] flex items-center gap-3 hover:bg-monochrome-lightgray"
      >
        <img src="/images/invest/icon_invest_graph.png" alt="chart icon" className="w-6 h-6" />
        <span className="text-body-04 text-neutral-1">투자 리포트 보러가기</span>
      </a>
    </div>
  )
}
