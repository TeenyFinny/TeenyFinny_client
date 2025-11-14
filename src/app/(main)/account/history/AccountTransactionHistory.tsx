"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  merchant: string;
  amount: number;
  balanceAfter: number;
  timestamp: string;
}

interface AccountTransactionHistoryProps {
  accountName: string;
  currentBalance: number;
  transactionsByMonth: Record<string, Transaction[]>;
  initialMonth: string;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
  onTabClick?: (tabName: string) => void;

  /** 상세 내역 보기 클릭 콜백 */
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function AccountTransactionHistory({
  accountName,
  currentBalance,
  transactionsByMonth,
  initialMonth,
  onBackClick,
  onNotificationClick,
  onTabClick,
  onTransactionClick,
}: AccountTransactionHistoryProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const listRef = useRef<HTMLDivElement>(null);

  const isCurrentMonth = currentMonth === initialMonth;

  const handlePreviousMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
  };

  const currentTransactions = transactionsByMonth?.[currentMonth] ?? [];
  const displayMonth = `${parseInt(currentMonth.split("-")[1])}월`;
  const formatAmount = (amount: number) => amount.toLocaleString("ko-KR");

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentMonth]);

  return (
    <div className="flex flex-col h-full bg-[#ffffff]">
      {/* 상단 */}
      <div className="flex-shrink-0">
        <div className="mx-4 mb-6 rounded-[20px] bg-[#fafcff] px-6 py-8 shadow-sm">
          <p className="text-body-07 mb-3 text-[#989898] whitespace-pre-line">
            {accountName}
          </p>
          <p className="text-account-title text-[#343434]">
            {formatAmount(currentBalance)} 원
          </p>
        </div>

        {/* 월 선택 */}
        <div className="mb-4 flex items-center justify-center gap-8">
          <button
            onClick={handlePreviousMonth}
            className="flex h-8 w-8 items-center justify-center text-[#898989] transition-opacity hover:opacity-70 active:opacity-50"
            aria-label="이전 월"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <span className="text-head-03 text-center text-[#343434]">
            {displayMonth}
          </span>

          {!isCurrentMonth ? (
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center text-[#898989] transition-opacity hover:opacity-70 active:opacity-50"
              aria-label="다음 월"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : (
            <div className="h-8 w-8" />
          )}
        </div>
      </div>

      {/* 거래내역 리스트 */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {currentTransactions.length > 0 ? (
          <div className="space-y-0">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() =>
                  alert(`${transaction.merchant} / ${transaction.amount}원`)
                }
                className="flex items-center justify-between border-b border-[#f6f7f8] py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-[#0d77cf]"
                        : "bg-[#e24851]"
                    }`}
                  />
                  <div>
                    <p className="text-body-04 mb-1 text-[#343434]">
                      {transaction.merchant}
                    </p>
                    <p className="text-body-08 text-[#989898]">
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-head-05 mb-1 text-[#343434]">
                    {formatAmount(transaction.amount)}
                  </p>
                  <p className="text-body-08 text-[#989898]">
                    {formatAmount(transaction.balanceAfter)}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-body-06 text-[#989898] py-10">
            거래 내역이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
