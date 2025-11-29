"use client"
import { HttpError } from "@/types/axios/httpError.t";
import requests from "@/lib/axios/requests"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import api from "@/lib/axios/axios";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";

interface HoldingItem {
  productCode: string;
  productName: string;
  quantity: string;
  avgPrice: string;
  currentPrice: string;
  evaluationAmount: string;
  profitAmount: string;
  profitRate: number;
  weight: number;
}

interface InvestDashboardRes {
  userId: number;
  depositAmount: string;
  totEvluAmt: string;
  totalProfitAmount: string;
  totalProfitRate: number;
  top3Holdings: HoldingItem[];
}

export default function Page() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<InvestDashboardRes | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // 최초 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) 계좌 존재 여부 체크
        const accountRes = await api.get(requests.investAccount);

        if (!accountRes.data) {
          router.push("/invest/no-account");
          return;
        }

        // 2) 대시보드 기본 데이터
        const res = await api.get<InvestDashboardRes>(requests.investDashboard);
        console.log("Dashboard data:", res.data);
        setDashboardData(res.data);
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

    fetchData();
  }, [router]);

  // 폴링 (데이터만 업데이트)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get<InvestDashboardRes>(requests.investDashboard);
        setDashboardData(res.data);
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  if (!dashboardData) return null;

  const isPositive = parseFloat(dashboardData.totalProfitAmount) >= 0;

  return (
    <div className="px-[18px]">
      {/* Investment Status */}
      <div className="w-[340px] pl-3">
        <div className="">
          {/* 추후 userstore로 변경 */}
          <h2 className="text-body-04 text-neutral-1">{"민트"}의</h2>
          <p className="text-body-06 text-neutral-1">총 투자 계좌 자산</p>
        </div>

        {/* Current Amount */}
        <div>
          <p className="text-landing-01 text-neutral-1 leading-none tracking-tight">
            {dashboardData.totEvluAmt} <span className="text-body-06">원</span>
          </p>
        </div>

        {/* Profit Amount */}
        <div className="relative mb-8 pr-26">
  {/* Profit Amount */}
  <p
    className={`text-body-06 ${
      isPositive ? "text-error" : "text-primary-1"
    }`}
  >
    {isPositive ? "↑" : "↓"}{" "}
    {dashboardData.totalProfitAmount}원 (
    {dashboardData.totalProfitRate}%)
  </p>

  {/* Right-aligned link */}
  <a
    href="/invest/my-stock-account"
    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-body-06 text-neutral-2 hover:text-neutral-1 transition-colors"
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
        {dashboardData.top3Holdings.map((stock, index) => (
          <div key={stock.productCode}>
            <TradeHistory
              stockName={stock.productName}
              stockCode={`보유 수량 ${stock.quantity}주`}
              currentPrice={`${stock.avgPrice} 원`}
              changeRate={stock.profitRate}
            />
            {/* 항목 사이 구분선 (마지막 요소 제외) */}
            {index < dashboardData.top3Holdings.length - 1 && (
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
