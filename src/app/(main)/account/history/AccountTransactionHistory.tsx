"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BottomSheetDetail from "@/components/custom/allowance/card/HistoryDetail";
import { useUserStore } from "@/store/userStore";
import { StateBadge } from "@/components/ui/badge/StateBadge";

/**
 * Transaction 타입
 */
interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  merchant: string;
  amount: number;
  balanceAfter: number;
  timestamp: string;
}

/**
 * DetailData 타입 (바텀시트에서 필요)
 */
interface DetailData {
  merchant: string;
  amount: number;
  date: string;
  type: string;
  category: string;
  approveAmount: number;
  balanceAfter: number;
}

interface AccountTransactionHistoryProps {
  childName: string;
  accountType: string;
  currentBalance: number;
  transactionsByMonth: Record<string, Transaction[]>;
  initialMonth: string;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
  onTabClick?: (tabName: string) => void;
  onTransactionClick?: (t: Transaction) => void;
}

export default function AccountTransactionHistory({
  childName,
  accountType,
  currentBalance,
  transactionsByMonth,
  initialMonth,
  onBackClick,
  onNotificationClick,
  onTabClick,
  onTransactionClick,
}: AccountTransactionHistoryProps) {
  const { userType } = useUserStore();
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const listRef = useRef<HTMLDivElement>(null);

  /**  상세 내역 바텀시트 상태 */
  const [sheetOpen, setSheetOpen] = useState(false);

  /** 선택된 거래의 상세 데이터 */
  const [detailData, setDetailData] = useState<DetailData | null>(null);

  /** 현재 월 계산 */
  const isCurrentMonth = currentMonth === initialMonth;
  const [currentYear, currentMonthNumber] = currentMonth.split("-").map(Number);
  const isMinMonth = currentYear === 2025 && currentMonthNumber === 1;

  /** 이전 / 다음 월 이동 */
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

  /** 현재 월 거래 리스트 */
  const currentTransactions = transactionsByMonth?.[currentMonth] ?? [];
  const displayMonth = `${parseInt(currentMonth.split("-")[1])}`;

  /** 숫자 포맷 */
  const formatAmount = (amount: number) => amount.toLocaleString("ko-KR");

  /** 월 변경 시 스크롤 맨 위로 */
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentMonth]);

  /**  거래 클릭 시 상세 바텀시트 열기 */
  const handleTransactionClick = (t: Transaction) => {
    const detail: DetailData = {
      merchant: t.merchant,
      amount: t.amount,
      date: t.timestamp.replace(".", "-"), // 날짜 형식 보정(optional)
      type: t.type === "deposit" ? "입금" : "출금",
      category: "쇼핑",
      approveAmount: t.amount,
      balanceAfter: t.balanceAfter,
    };

    setDetailData(detail);
    setSheetOpen(true);

    onTransactionClick?.(t); // 필요하면 외부로도 전달
  };

  return (
    <div className="flex flex-col h-full">
      {/* 상단 */}
      <div className="flex-shrink-0 mt-[36px]">
        <div className="h-[130px] mx-[18px] p-[24px] rounded-[16px] bg-primary-1/12 shadow-sm">
          {/* 제목 + 용돈조르기 버튼 */}
          <div className="flex items-center justify-between mb-[10px]">
            <p className="text-body-05 text-neutral-3 whitespace-pre-line">
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

          {/* 잔액 */}
          <p className="text-account-title text-netural-1">
            {formatAmount(currentBalance)} 원
          </p>
        </div>

        {/* 월 선택 */}
        <div className="mx-[20px] mt-[36px] mb-[3px] flex items-center justify-between">
          {!isMinMonth ? (
            <Image
              src="/icons/arrow-left.png"
              alt="보기"
              width={24}
              height={24}
              onClick={handlePreviousMonth}
            />
          ) : (
            <div className="h-[24px] w-[24px]" />
          )}

          <span className="text-head-06 w-[50px] text-center text-neutral-1">
            2025.{displayMonth}
          </span>

          {!isCurrentMonth ? (
            <Image
              src="/icons/arrow-left.png"
              alt="보기"
              width={24}
              height={24}
              className="rotate-180"
              onClick={handleNextMonth}
            />
          ) : (
            <div className="h-[24px] w-[24px]" />
          )}
        </div>
      </div>

      {/* 거래 리스트 */}
      <div
        ref={listRef}
        className="flex-1 mt-[3px] overflow-y-auto px-[20px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {currentTransactions.length > 0 ? (
          <div className="space-y-0">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)} // 상세 바텀시트 열기
                className="flex h-[76px] items-center justify-between border-b border-monochrome-gray last:border-b-0"
              >
                <div className="flex items-center gap-[12px]">
                  <div
                    className={`h-[12px] w-[12px] rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-chart-3"
                        : "bg-chart-10"
                    }`}
                  />
                  <div>
                    <p className="text-head-04 mb-[5px] text-neutral-1">
                      {transaction.merchant}
                    </p>
                    <p className="text-body-07 text-neutral-3">
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-head-08 mb-[5px] text-neutral-1">
                    {formatAmount(transaction.amount)}
                  </p>
                  <p className="text-body-07 text-neutral-3">
                    {formatAmount(transaction.balanceAfter)}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-body-06 text-neutral-2 py-10">
            거래 내역이 없습니다.
          </p>
        )}
      </div>

      {/* 상세 바텀시트 */}
      {detailData && (
        <BottomSheetDetail
          open={sheetOpen}
          setOpen={setSheetOpen}
          shouldOverlayBottomBar={true}
          detail={detailData}
        />
      )}
    </div>
  );
}
