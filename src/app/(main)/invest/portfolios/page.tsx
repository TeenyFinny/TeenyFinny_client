"use client";

import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvestStatusWithChart from "@/components/ui/invest/InvestStatusWithChart";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";


import { useUserStore } from "@/store/userStore";
import { useSelectedChildStore } from "@/store/selectedChildStore";

interface PortfolioDate {
  year: number;
  month: number;
}

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
  const [dates, setDates] = useState<PortfolioDate[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioRes | null>(null);
  const [loading, setLoading] = useState(true);
  const userName = useUserStore((state) => state.userName);
  const selectedChildId = useSelectedChildStore((state) => state.selectedChildId);

  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  // 1. Fetch available dates on mount
  useEffect(() => {
    (async () => {
      try {
        const childParam = selectedChildId ? `?childId=${selectedChildId}` : "";
        const dateRes = await api.get(`${requests.portfolio}/dates${childParam}`);
        const availableDates: PortfolioDate[] = dateRes.data;

        setDates(availableDates);

        if (availableDates.length > 0) {
          // Default to previous month relative to today
          const today = new Date();
          const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const targetYear = prevMonthDate.getFullYear();
          const targetMonth = prevMonthDate.getMonth() + 1;

          // Check if previous month exists in available dates
          const hasPrevMonth = availableDates.some(d => d.year === targetYear && d.month === targetMonth);

          if (hasPrevMonth) {
            setYear(targetYear);
            setMonth(targetMonth);
          } else {
            // Fallback to the latest available date
            setYear(availableDates[0].year);
            setMonth(availableDates[0].month);
          }
        } else {
          setLoading(false);
        }

      } catch (e) {
        console.error("Failed to fetch dates", e);
        setLoading(false);
      }
    })();
  }, [selectedChildId]);

  // 2. Fetch portfolio when year/month changes
  useEffect(() => {
    if (year === null || month === null) return;

    (async () => {
      setLoading(true);
      try {
        const query = selectedChildId
          ? `${requests.portfolio}?year=${year}&month=${month}&childId=${selectedChildId}`
          : `${requests.portfolio}?year=${year}&month=${month}`;

        const res = await api.get(query);
        const data = res.data;
        if (!data) throw new Error("No portfolio data found");
        setPortfolio(data);
      } catch (e) {
        const err = e as HttpError;
        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          alert(err.message);
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [year, month, selectedChildId, router]);


  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-neutral-2 mb-4">포트폴리오 정보가 없습니다.</div>
      </div>
    );
  }

  const { depositAmount, totEvluAmt, totalProfitAmount, totalProfitRate, holdings, topHoldings } = portfolio;

  const isPositive = parseFloat(totalProfitRate) >= 0;

  const investSummary = {
    userName: userName,
    currentAmount: totEvluAmt,
    profitAmount: totalProfitAmount,
    profitRate: totalProfitRate,
    availableAmount: depositAmount,
    isPositive: isPositive,
  };

  // Extract unique years for the year dropdown
  const availableYears = Array.from(new Set(dates.map(d => d.year))).sort((a, b) => b - a);

  // Filter months based on selected year
  const availableMonths = dates
    .filter(d => d.year === year)
    .map(d => d.month)
    .sort((a, b) => a - b);

  return (
    <div className="px-[18px]">
      <div className="flex gap-3 items-center mt-6 mb-6">
        <select
          className="border rounded-lg p-2"
          value={year ?? ""}
          onChange={(e) => {
            const newYear = Number(e.target.value);
            setYear(newYear);
            // When year changes, check if current month is valid for new year
            const validMonths = dates.filter(d => d.year === newYear).map(d => d.month);
            if (!validMonths.includes(month!)) {
              setMonth(validMonths[0]); // Default to latest month of that year (since dates are DESC)
            }
          }}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg p-2"
          value={month ?? ""}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {availableMonths.map((m) => (
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
