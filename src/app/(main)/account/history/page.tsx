"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { StateBadge } from "@/components/ui/badge/StateBadge";
import { BottomSheetDetail } from "@/components/custom/account/BottomSheetDetail";
import { BottomSheetHistoryFilter } from "@/components/custom/account/BottomSheetHistoryFilter";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import { useSearchParams } from "next/navigation";
import { Settings } from "lucide-react";

interface Transaction {
  transactionId: string;
  type: "deposit" | "withdrawal";
  merchant: string;
  amount: string;
  balanceAfter: string;
  timestamp: string;
}

interface DetailData {
  merchant: string;
  amount: string;
  date: string;
  type: string;
  category: string;
  approveAmount: string;
  balanceAfter: string;
}

function HistoryPageContent() {
  const { userType } = useUserStore();
  const searchParams = useSearchParams();

  /** Zustand 전역 State */
  const {
    selectedChildId,
    selectedChildName,
    accountName,
    accountType,
    balance,
  } = useSelectedChildStore();

  /** 거래내역 */
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /** 필터 및 상세 시트 상태 */
  const [filterOpen, setFilterOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  /** 조회 기간 필터 (기본값: 3개월) */
  const [timeRange, setTimeRange] = useState("3m");
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);

  /** 기간에 따른 시작일/종료일 계산 */
  const { startDate, endDate } = useMemo(() => {
    // Custom date range takes priority
    if (customStartDate && customEndDate) {
      return {
        startDate: customStartDate,
        endDate: customEndDate,
      };
    }

    const end = new Date();
    const start = new Date();

    switch (timeRange) {
      case "1m":
        // 이번 달 (1일 ~ 현재)
        start.setDate(1);
        break;
      case "3m":
        // 3개월 전
        start.setMonth(start.getMonth() - 3);
        break;
      case "6m":
        // 6개월 전
        start.setMonth(start.getMonth() - 6);
        break;
      case "1y":
        // 1년 전
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 3);
    }

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  }, [timeRange, customStartDate, customEndDate]);

  /* ----------------------------
   *  거래내역 API 호출
   * ---------------------------- */
  useEffect(() => {
    if (!selectedChildId || !accountType) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const isParent = userType === "parent";
        const url = isParent
          ? requests.fetchChildHistory(selectedChildId) // 부모 → /account/{childId}/history
          : requests.fetchMyHistory; // 자녀 → /account/history
        
        const res = await api.get(url, {
          params: {
            startDate,
            endDate,
          },
        });

        setTransactions(res.data);
      } catch (error) {
        console.error("거래 내역 조회 중 오류가 발생했습니다:", error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [selectedChildId, accountType, startDate, endDate, userType]);

  /* ----------------------------
   *  상세 클릭 → API
   * ---------------------------- */
  const handleTransactionClick = async (t: Transaction) => {
    setSelectedId(t.transactionId);
    setSheetOpen(true);
    setLoadingDetail(true);

    try {
      const res = await api.get(requests.fetchTransactionDetail(t.transactionId));
      setDetail(res.data);
    } finally {
      setLoadingDetail(false);
    }
  };

  /* ----------------------------
   *  필터 핸들러
   * ---------------------------- */
  const handleSelectRange = (range: string) => {
    setTimeRange(range);
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  const handleSelectCustom = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setTimeRange("custom");
  };

  /* ----------------------------
   *  기간 표시 텍스트
   * ---------------------------- */
  const rangeLabel = useMemo(() => {
    if (customStartDate && customEndDate) {
      return `${customStartDate} ~ ${customEndDate}`;
    }
    switch (timeRange) {
      case "1m": return "이번 달";
      case "3m": return "3개월";
      case "6m": return "6개월";
      case "1y": return "1년";
      default: return "3개월";
    }
  }, [timeRange, customStartDate, customEndDate]);

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 카드 */}
      <div className="mt-[36px]">
        <div className="h-[130px] mx-[18px] p-[24px] rounded-[16px] bg-primary-1/12">
          <div className="flex justify-between mb-[10px]">
            <p className="text-body-05 text-neutral-3">
              {selectedChildName}님의 {accountName}
            </p>

            {userType === "child" && (
              <StateBadge
                enabled={true}
                label="용돈조르기"
                onClick={() => alert("버튼 클릭됨")}
              />
            )}
          </div>

          <p className="text-account-title text-neutral-1">{balance} 원</p>
        </div>

        {/* 필터 설정 영역 */}
        <div className="mx-[20px] mt-[24px] flex justify-end items-center">
          <button 
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1 text-body-04 text-neutral-2"
          >
            <span>{rangeLabel}</span>
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 거래 리스트 */}
      <div className="flex-1 overflow-y-auto px-[20px] mt-[12px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-body-04 text-neutral-2">
            불러오는 중...
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((t) => (
            <div
              key={t.transactionId}
              onClick={() => handleTransactionClick(t)}
              className="flex h-[76px] items-center justify-between border-b border-monochrome-gray cursor-pointer"
            >
              <div className="flex items-center gap-[12px]">
                <div
                  className={`w-[12px] h-[12px] rounded-full ${
                    t.type === "deposit" ? "bg-chart-3" : "bg-chart-10"
                  }`}
                />
                <div>
                  <p className="text-head-04 text-neutral-1">{t.merchant}</p>
                  <p className="text-body-07 text-neutral-3">{t.timestamp}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-head-08 text-neutral-1">{t.amount}원</p>
                <p className="text-body-07 text-neutral-3">
                  {t.balanceAfter}원
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-body-06 text-neutral-2 py-10">
            거래 내역이 없습니다.
          </p>
        )}
      </div>

      {/* 상세 바텀시트 */}
      <BottomSheetDetail
        open={sheetOpen}
        setOpen={setSheetOpen}
        detail={detail}
        shouldOverlayBottomBar
      />

      {/* 필터 바텀시트 */}
      <BottomSheetHistoryFilter
        open={filterOpen}
        setOpen={setFilterOpen}
        selectedRange={timeRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onSelectRange={handleSelectRange}
        onSelectCustom={handleSelectCustom}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full">로딩중...</div>}>
      <HistoryPageContent />
    </Suspense>
  );
}

