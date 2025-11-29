"use client";

import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvestStatusWithChart from "@/components/ui/invest/InvestStatusWithChart";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";
import { DonutChart } from "@/components/ui/invest/DonutChart";


import { useUserStore } from "@/store/userStore";

interface PortfolioRes {
  userId: number;
  depositAmount: string; // 예수금
  totEvluAmt: string; // 총 평가금액 (실시간)
  totalProfitAmount: string; // 총 수익금
  totalProfitRate: string; // 총 수익률
  holdings: HoldingItemRes[]; // 보유 종목 상세 리스트
  topHoldings: TopHoldingItem[]; // 상위 3개 + 기타
}

interface TopHoldingItem {
  productName: string;
  weight: number;
}

interface HoldingItemRes {
  productCode: string;
  productName: string;
  quantity: string;
  avgPrice: string;
  currentPrice: string;
  evaluationAmount: string;
  profitAmount: string;
  profitRate: string;
  weight: number;
}


export default function Page() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioRes | null>(null);
  const [loading, setLoading] = useState(true);
  const userName = useUserStore((state) => state.userName);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  useEffect(() => {
    (async () => {
      try {
        console.log(`Fetching portfolio for ${year}-${month}`);
        const res = await api.get(`${requests.portfolio}?year=${year}&month=${month}`);
        const data = res.data;
        if (!data) throw new Error("No portfolio data found");

        setPortfolio(data);
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
    })();
  }, [year, month, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  if (!portfolio) {
    return <div>포트폴리오 정보 없음</div>;
  }

  const { depositAmount, totEvluAmt, totalProfitAmount, totalProfitRate, holdings, topHoldings } = portfolio;

  // Assuming isPositive logic needs to be derived since it's not in the DTO
  const isPositive = parseFloat(totalProfitRate) >= 0;

  const investSummary = {
    userName: userName,
    currentAmount: totEvluAmt,
    profitAmount: totalProfitAmount,
    profitRate: totalProfitRate,
    availableAmount: depositAmount,
    isPositive: isPositive,
  };

  return (
    <div className="px-[18px]">
      <div className="flex gap-3 items-center mt-6 mb-6">
        <select
          className="border rounded-lg p-2"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg p-2"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
      </div>
      {/* Summary Section */}
      <InvestStatusWithChart {...investSummary} holdings={topHoldings.map(h => ({ name: h.productName, percentage: h.weight }))} />


      {/* My Stocks Section */}
      <h2 className="text-head-06 text-neutral-2 px-5 pt-4 mt-12">내가 산 주식</h2>
      <div className="mb-5 mt-2 w-[340px] bg-white rounded-[16px] shadow-lg">
        {holdings.map((stock, index) => (
          <div key={stock.productName}>
            <TradeHistory
              stockName={stock.productName}
              stockCode={`보유 ${stock.quantity}주`}
              currentPrice={`${stock.avgPrice} 원`}
              changeRate={Number(stock.profitRate)}
            />
            {index < holdings.length - 1 && (
              <div className="mx-5 h-[1px] bg-monochrome-gray" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


