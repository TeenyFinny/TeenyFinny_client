"use client";

import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvestStatusWithChart from "@/components/ui/invest/InvestStatusWithChart";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";
import { DonutChart } from "@/components/ui/invest/DonutChart";


interface PortfolioSummary {
  portfolioId: string;
  totEvluAmt: string; // 총 평가금액
  sctsEvluAmt: string; // 유가증권 평가 금액
  dncaTotAmt: string; // 예수금
  profitAmount: string; // 수익금
  profitRate: string; // 수익률 (%)
  isPositive: boolean; // 수익률이 양수인지 여부
}

interface HoldingSummary {
  name: string;
  percentage: number;
}

interface Stock {
  prdtName: string;
  hldgQty: string;
  pchsAvgPric: string;
  profitRate: string;
  isPositive: boolean;
}

interface PortfolioData {
  summary: PortfolioSummary;
  holdingsSummary: HoldingSummary[];
  myStocks: Stock[];
}


export default function Page() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.post(requests.portfolio);
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
  }, [router]);

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

  const { summary, holdingsSummary, myStocks } = portfolio;

  const investSummary = {
    userName: "민트",
    currentAmount: summary.totEvluAmt,
    profitAmount: summary.profitAmount,
    profitRate: summary.profitRate,
    availableAmount: summary.dncaTotAmt,
    isPositive: summary.isPositive,
  };

  return (
    <div className="px-[18px]">
      {/* Summary Section */}
      <InvestStatusWithChart {...investSummary} holdings={holdingsSummary}/>


      {/* My Stocks Section */}
      <div className="mb-5 w-[340px] mt-12 bg-white rounded-[16px] shadow-lg">
        <h2 className="text-head-06 text-neutral-2 px-5 pt-4">내가 산 주식</h2>
        {myStocks.map((stock, index) => (
          <div key={stock.prdtName}>
            <TradeHistory
              stockName={stock.prdtName}
              stockCode={`보유 ${stock.hldgQty}주`}
              currentPrice={`${Number(stock.pchsAvgPric).toLocaleString()} 원`}
              changeRate={Number(stock.profitRate)}
            />
            {index < myStocks.length - 1 && (
              <div className="mx-5 h-[1px] bg-monochrome-gray" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


