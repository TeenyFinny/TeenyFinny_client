"use client";

import { InvestStatus } from "@/components/ui/invest/InvestStatus";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";

import { useUserStore } from "@/store/userStore";

// =========================
//  타입 정의 (백엔드 기준)
// =========================

interface Holding {
  productCode: string;
  productName: string;
  quantity: number;
  avgPrice: number;
  evaluationAmount: number;
  profitAmount: number;
  profitRate: number;
  weight: number;
}

interface InvestSummary {
  depositAmount: string;
  totEvluAmt: string;
  totalProfitAmount: string;
  totalProfitRate: number;
}

export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Holding[]>([]);
  const [investSummary, setInvestSummary] = useState<InvestSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const userName = useUserStore((state) => state.userName);

  const isMounted = useRef(true);

  // unmount 감지
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // =====================================
  //  1) 초기 로드 + 폴링 주기 3초 설정
  // =====================================
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      if (!isMounted.current) return;

      try {
        const res = await api.get(requests.investMyAccount);
        const data = res.data;

        // ===== holdings 부분 비교 후 업데이트 =====
        setStocks((prev) => {
          if (!prev || prev.length !== data.holdings.length) {
            return data.holdings;
          }

          const changed = data.holdings.some((item: Holding, i: number) => {
            const p = prev[i];
            return (
              p.productCode !== item.productCode ||
              p.quantity !== item.quantity ||
              p.avgPrice !== item.avgPrice ||
              p.profitRate !== item.profitRate
            );
          });

          return changed ? data.holdings : prev;
        });

        // ===== summary 부분 비교 후 업데이트 =====
        setInvestSummary((prev) => {
          if (!prev) {
            return {
              depositAmount: data.depositAmount,
              totEvluAmt: data.totEvluAmt,
              totalProfitAmount: data.totalProfitAmount,
              totalProfitRate: data.totalProfitRate,
            };
          }

          const changed =
            prev.depositAmount !== data.depositAmount ||
            prev.totEvluAmt !== data.totEvluAmt ||
            prev.totalProfitAmount !== data.totalProfitAmount ||
            prev.totalProfitRate !== data.totalProfitRate;

          return changed
            ? {
              depositAmount: data.depositAmount,
              totEvluAmt: data.totEvluAmt,
              totalProfitAmount: data.totalProfitAmount,
              totalProfitRate: data.totalProfitRate,
            }
            : prev;
        });

        setLoading(false);
      } catch (e) {
        const err = e as HttpError;

        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          console.error(err);
        }
      }
    };

    // 처음 1회 즉시 실행
    fetchData();

    // 3초마다 실행
    interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [router]);

  // 로딩 상태 처리
  if (loading || !investSummary) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        로딩중...
      </main>
    );
  }

  const investStatusProps = {
    userName: userName,
    currentAmount: investSummary.totEvluAmt,
    profitAmount: investSummary.totalProfitAmount,
    profitRate: String(investSummary.totalProfitRate),
    availableAmount: investSummary.depositAmount,
    isPositive: investSummary.totalProfitRate >= 0,
  };

  // =====================================
  //  렌더링
  // =====================================
  return (
    <main>
      <div className="flex flex-col items-center pt-6">

        {/* 투자 요약 카드 */}
        <InvestStatus {...investStatusProps} />

        <h2 className="text-head-06 text-neutral-2 px-4 pt-12 self-start">
          내가 산 주식
        </h2>

        <div className="mb-5 mt-2 w-[376px] flex flex-col">
          <div className="flex items-center justify-between px-6">
            <span className="text-body-07 text-neutral-2 mt-3">종목명</span>
            <span className="text-body-07 text-neutral-2 mt-3">평균단가</span>
          </div>

          <div className="mx-5 h-[1px] mt-[10px] bg-monochrome-gray" />

          {stocks.map((stock, index) => (
            <div
              key={stock.productCode}
              onClick={() =>
                router.push(
                  `/invest/stock-details?stck_shrn_iscd=${stock.productCode}&mode=buy`
                )
              }
            >
              <TradeHistory
                stockName={stock.productName}
                stockCode={`보유 ${stock.quantity}주`}
                currentPrice={`${stock.avgPrice.toLocaleString()} 원`}
                changeRate={stock.profitRate}
              />

              {index < stocks.length - 1 && (
                <div className="mx-5 h-[1px] bg-monochrome-gray" />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
