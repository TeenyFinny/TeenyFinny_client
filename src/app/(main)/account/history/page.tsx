"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { StateBadge } from "@/components/ui/badge/StateBadge";
import { BottomSheetDetail } from "@/components/custom/account/BottomSheetDetail";
import { useAccountHistoryStore } from "@/store/accountHistory";

interface Transaction {
  id: string;
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

export default function Page() {
  const { userType } = useUserStore();

  /** Zustand 전역 State (완전 stateful) */
  const {
    childId,
    childName,
    accountName,
    accountType,
    balance,
    year,
    month,
    setHistoryData,
  } = useAccountHistoryStore();

  /** 거래내역 */
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /** 상세 시트 */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  /** yyyy-mm UI용 변수 */
  const currentMonth = `${year}-${String(month).padStart(2, "0")}`;

  /* ----------------------------
   *  월 이동 → Zustand 업데이트만 함
   * ---------------------------- */
  const goPrevMonth = () => {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setHistoryData({ year: newYear, month: newMonth });
  };

  const goNextMonth = () => {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setHistoryData({ year: newYear, month: newMonth });
  };

  /* ----------------------------
   *  거래내역 API 호출 (완전 state 기반)
   * ---------------------------- */
  useEffect(() => {
    if (!childId || !accountType) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get(requests.fetchAccountHistory, {
          params: {
            childId,
            accountType,
            year,
            month,
          },
        });

        setTransactions(res.data);
      } catch (error) {
        console.error("거래 내역 조회 중 오류가 발생했습니다:", error);
        setTransactions([]); // 오류 발생 시 목록을 비워 사용자에게 피드백
      }
    };
  }, [childId, accountType, year, month]);

  /* ----------------------------
   *  상세 클릭 → API
   * ---------------------------- */
  const handleTransactionClick = async (t: Transaction) => {
    setSelectedId(t.id);
    setSheetOpen(true);
    setLoadingDetail(true);

    try {
      const res = await api.get(requests.fetchTransactionDetail, {
        params: { transactionId: t.id },
      });

      setDetail(res.data[0]);
    } finally {
      setLoadingDetail(false);
    }
  };

  /* ----------------------------
   *  JSX
   * ---------------------------- */
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 카드 */}
      <div className="mt-[36px]">
        <div className="h-[130px] mx-[18px] p-[24px] rounded-[16px] bg-primary-1/12">
          <div className="flex justify-between mb-[10px]">
            <p className="text-body-05 text-neutral-3">
              {childName}님의 {accountName}
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

        {/* 월 선택 */}
        <div className="mx-[20px] mt-[36px] flex justify-between items-center">
          {month !== 1 ? (
            <Image
              src="/icons/arrow-left.png"
              width={24}
              height={24}
              alt="prev"
              onClick={goPrevMonth}
              className="cursor-pointer"
            />
          ) : (
            <div style={{ width: 24 }} />
          )}

          <span className="text-head-06 text-neutral-1">{currentMonth}</span>

          {month !== 12 ? (
            <Image
              src="/icons/arrow-left.png"
              width={24}
              height={24}
              alt="next"
              className="rotate-180 cursor-pointer"
              onClick={goNextMonth}
            />
          ) : (
            <div style={{ width: 24 }} />
          )}
        </div>
      </div>

      {/* 거래 리스트 */}
      <div className="flex-1 overflow-y-auto px-[20px]">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <div
              key={t.id}
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
      {sheetOpen && (
        <BottomSheetDetail
          open={sheetOpen}
          setOpen={setSheetOpen}
          detail={detail}
          shouldOverlayBottomBar
        />
      )}
    </div>
  );
}
