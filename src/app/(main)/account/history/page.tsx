"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { StateBadge } from "@/components/ui/badge/StateBadge";
import { BottomSheetDetail } from "@/components/custom/account/BottomSheetDetail";
import { useSearchParams } from "next/navigation";

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

interface Props {
  childName: string;
  accountType: string;
  currentBalance: number;
}

export default function Page({
  childName,
  accountType,
  currentBalance,
}: Props) {
  const { userType } = useUserStore();
  const params = useSearchParams();

  const childId = params.get("childId");
  const account = params.get("account");

  // 기본 월
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  // month split
  const [year, month] = currentMonth.split("-").map(Number);

  /* 월 이동 */
  const goPrevMonth = () => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
  };

  const goNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
  };

  /* 거래내역 불러오기 */
  useEffect(() => {
    if (!childId || !account) return;

    const [yearStr, monthStr] = currentMonth.split("-");

    const fetchHistory = async () => {
      const res = await api.get(requests.fetchAccountHistory, {
        params: {
          childId: Number(childId),
          accountType: account,
          year: yearStr,
          month: monthStr,
        },
      });

      setTransactions(res.data);
    };

    fetchHistory();
  }, [childId, account, currentMonth]);

  /* 거래 클릭 → id 저장 → 상세 가져오기 */
  const handleTransactionClick = async (t: Transaction) => {
    console.log(t.id);
    setSelectedId(t.id);
    setSheetOpen(true);
    setLoadingDetail(true);

    try {
      const res = await api.get(requests.fetchTransactionDetail, {
      params: {
        transactionId: t.id,   // ← 쿼리 파라미터로 id 전달
      },
    });
    console.log(res.data[0])
      setDetail(res.data[0]);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 상단 카드 영역 */}
      <div className="mt-[36px]">
        <div className="h-[130px] mx-[18px] p-[24px] rounded-[16px] bg-primary-1/12">
          <div className="flex justify-between mb-[10px]">
            <p className="text-body-05 text-neutral-3">
              {childName}님의 {accountType} 계좌
            </p>

            {userType === "child" && (
              <StateBadge
                enabled={true}
                label="용돈조르기"
                onClick={() => alert("버튼 클릭됨")}
              />
            )}
          </div>

          <p className="text-account-title text-neutral-1">
            {currentBalance} 원
          </p>
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
            <div style={{ width: 24, height: 24 }} />
          )}

          <span className="text-head-06 text-neutral-1">{currentMonth}</span>

          {month !== 12 ? (
            <Image
              src="/icons/arrow-left.png"
              width={24}
              height={24}
              className="rotate-180 cursor-pointer"
              alt="next"
              onClick={goNextMonth}
            />
          ) : (
            <div style={{ width: 24, height: 24 }} />
          )}
        </div>
      </div>

      {/* 거래 리스트 */}
      <div ref={listRef} className="flex-1 mt-[3px] overflow-y-auto px-[20px]">
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
      {selectedId && (
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
