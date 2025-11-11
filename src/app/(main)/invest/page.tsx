"use client"
import { HttpError } from "@/types/axios/httpError.t";
import requests from "@/lib/axios/requests"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";


export default function Page(){
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [investSummary, setInvestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    (async () => {
      try {
        const [stockRes, investRes] = await Promise.all([
          api.get(requests.dashMyStockList),
          api.get(requests.investSummary),
        ]);
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

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  return (
    <div className="px-[18px]">
      {/* Investment Status */}
      <div className="w-[340px] pl-6 pt-0 mt-0">
        <div className="">
          <h2 className="text-body-06 text-neutral-1">{investSummary.userName}의</h2>
          <p className="text-body-06 text-neutral-1">총 투자 현황입니다.</p>
        </div>

        {/* Current Amount */}
        <div>
          <p className="text-landing-01 text-neutral-1 leading-none tracking-tight">
            {investSummary.currentAmount} <span className="text-body-06">원</span>
          </p>
        </div>

        {/* Profit Amount */}
        <div className="mb-6">
          <p className={`text-body-07 ${investSummary.isPositive ? "text-error" : "text-primary-1"}`}>
            {investSummary.isPositive ? "↑" : "↓"} {investSummary.profitAmount}원 (
            {investSummary.profitRate}%)
          </p>
        </div>
      </div>

      {/* Account Link */}
      <div className="mb-2 flex justify-end">
        <a
          href="/invest/myStockAccountView"
          className="flex items-center gap-1 text-body-06 text-neutral-2 hover:text-neutral-1 transition-colors"
        >
          내 계좌 보기
          <img src="/icons/arrow-right.png" alt="arrow-right icon" className="w-6 h-6" />
        </a>
      </div>

      {/* My Stocks Section */}
      <div className="mb-5 w-[340px] bg-white rounded-[16px] shadow-lg">
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

      {/* Trading Buttons */}
      <div className="flex items-center justify-center gap-4 mb-5 mt-6">
        {/* Buy Button */}
        <a href="/invest/myStockAccountView" className="flex flex-col items-center hover:opacity-80 transition-opacity bg-neutral-7 w-[162px] h-[120px] rounded-[16px] shadow-lg">
          <img
            src="/images/invest/illust_invest_characoin.png"
            alt="주식 사기"
            className="mb-2 mt-4"
          />
          <span className="text-head-04">
            주식 <span className="text-error">사기</span>
          </span>
        </a>

        {/* Sell Button */}
        <a href="/invest/myStockAccountView" className="flex flex-col items-center hover:opacity-80 transition-opacity bg-neutral-7 w-[162px] h-[120px] rounded-[16px] shadow-lg">
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
        href="/invest/myStockAccountView"
        className="w-full py-3 px-5 mb-6 bg-neutral-7 border border-monochrome-gray rounded-[20px] flex items-center gap-3 hover:bg-monochrome-lightgray"
      >
        <img src="/images/invest/icon_invest_graph.png" alt="chart icon" className="w-6 h-6" />
        <span className="text-body-04 text-neutral-1">투자 리포트 보러가기</span>
      </a>
    </div>
  )
}
