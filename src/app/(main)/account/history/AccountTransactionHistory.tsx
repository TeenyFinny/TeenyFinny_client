"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/**
 * Transaction
 * @typedef {Object} Transaction
 * @property {string} id - 거래의 고유 식별자입니다.
 * @property {"deposit" | "withdrawal"} type - 거래 유형입니다. "deposit"(입금) 또는 "withdrawal"(출금)입니다.
 * @property {string} merchant - 거래처 또는 상점명입니다.
 * @property {number} amount - 거래 금액입니다.
 * @property {number} balanceAfter - 거래 후 잔액입니다.
 * @property {string} timestamp - 거래 발생 시각입니다.
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
 * AccountTransactionHistoryProps
 * @typedef {Object} AccountTransactionHistoryProps
 * @property {string} childName - 자녀의 이름입니다.
 * @property {string} accountType - 계좌의 유형입니다 (예: "용돈", "저축" 등).
 * @property {number} currentBalance - 현재 계좌 잔액입니다.
 * @property {Record<string, Transaction[]>} transactionsByMonth - 월별로 그룹화된 거래 내역입니다. 키는 "YYYY-MM" 형식입니다.
 * @property {string} initialMonth - 초기에 표시할 월입니다. "YYYY-MM" 형식입니다.
 * @property {() => void} [onBackClick] - 뒤로가기 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {() => void} [onNotificationClick] - 알림 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {(tabName: string) => void} [onTabClick] - 탭 클릭 시 실행될 콜백 함수입니다.
 * @property {(transaction: Transaction) => void} [onTransactionClick] - 거래 항목 클릭 시 실행될 콜백 함수입니다.
 */
interface AccountTransactionHistoryProps {
  childName: string;
  accountType: string;
  currentBalance: number;
  transactionsByMonth: Record<string, Transaction[]>;
  initialMonth: string;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
  onTabClick?: (tabName: string) => void;

  /** 상세 내역 보기 클릭 콜백 */
  onTransactionClick?: (transaction: Transaction) => void;
}

/**
 * AccountTransactionHistory
 *
 * 자녀의 계좌 거래 내역을 월별로 조회할 수 있는 컴포넌트입니다.
 * 
 * ### 특징
 * - 현재 계좌 잔액을 상단에 표시합니다.
 * - 월 단위로 거래 내역을 탐색할 수 있습니다.
 * - 2025년 1월 이전으로는 탐색할 수 없습니다.
 * - 현재 월보다 미래로는 탐색할 수 없습니다.
 * - 각 거래 항목을 클릭하여 상세 정보를 볼 수 있습니다.
 *
 * ### 시각적 구성
 * - 상단에 계좌 정보 및 잔액 표시 영역 (`bg-primary-1/12`)
 * - 중앙에 월 선택 네비게이션 (이전/다음 화살표)
 * - 하단에 스크롤 가능한 거래 내역 리스트
 * - 입금은 초록색(`bg-chart-3`), 출금은 붉은색(`bg-chart-10`) 점으로 표시
 *
 * @component
 * @param {AccountTransactionHistoryProps} props - AccountTransactionHistory 컴포넌트 속성
 * @returns {React.ReactElement} 계좌 거래 내역 화면 요소
 *
 * @example
 * ```tsx
 * const transactions = {
 *   "2025-01": [
 *     {
 *       id: "1",
 *       type: "deposit",
 *       merchant: "용돈",
 *       amount: 10000,
 *       balanceAfter: 50000,
 *       timestamp: "2025-01-15 14:30"
 *     }
 *   ]
 * }
 *
 * <AccountTransactionHistory
 *   childName="홍길동"
 *   accountType="용돈"
 *   currentBalance={50000}
 *   transactionsByMonth={transactions}
 *   initialMonth="2025-01"
 *   onTransactionClick={(transaction) => console.log(transaction)}
 * />
 * ```
 */
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
  /** 현재 선택된 월을 관리하는 상태입니다. "YYYY-MM" 형식입니다. */
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  
  /** 거래 내역 리스트의 스크롤을 제어하기 위한 ref입니다. */
  const listRef = useRef<HTMLDivElement>(null);

  /** 현재 선택된 월이 초기 월(최신 월)인지 확인합니다. */
  const isCurrentMonth = currentMonth === initialMonth;

  /** 현재 선택된 월이 최소 월(2025년 1월)인지 확인합니다. */
  const [currentYear, currentMonthNumber] = currentMonth.split("-").map(Number);
  const isMinMonth = currentYear === 2025 && currentMonthNumber === 1;

  /**
   * 이전 월로 이동하는 핸들러입니다.
   * 1월인 경우 이전 해의 12월로 이동합니다.
   */
  const handlePreviousMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
  };

  /**
   * 다음 월로 이동하는 핸들러입니다.
   * 12월인 경우 다음 해의 1월로 이동합니다.
   */
  const handleNextMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
  };

  /** 현재 선택된 월의 거래 내역 배열입니다. */
  const currentTransactions = transactionsByMonth?.[currentMonth] ?? [];
  
  /** 화면에 표시할 월입니다. "MM" 형식으로 변환합니다. */
  const displayMonth = `${parseInt(currentMonth.split("-")[1])}`;
  
  /**
   * 숫자를 한국어 화폐 형식으로 포맷팅합니다.
   * @param {number} amount - 포맷팅할 금액
   * @returns {string} 콤마가 포함된 금액 문자열
   */
  const formatAmount = (amount: number) => amount.toLocaleString("ko-KR");

  /**
   * 월이 변경될 때마다 거래 내역 리스트를 최상단으로 스크롤합니다.
   */
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentMonth]);

  return (
    <div className="flex flex-col h-full">
      {/* 상단 계좌 정보 영역 */}
      <div className="flex-shrink-0 mt-[36px]">
        {/* 계좌 잔액 카드 */}
        <div className="h-[130px] mx-[18px] p-[24px] rounded-[16px] bg-primary-1/12 shadow-sm">
          <p className="text-body-05 mb-[10px] text-neutral-3 whitespace-pre-line">
            {childName}님의 {accountType} 계좌
          </p>
          <p className="text-account-title text-netural-1">
            {formatAmount(currentBalance)} 원
          </p>
        </div>

        {/* 월 선택 네비게이션 */}
        <div className="mx-[20px] mt-[36px] mb-[3px] flex items-center justify-between">

          {/* 이전 월 버튼 (2025년 1월이면 숨김) */}
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

          {/* 현재 선택된 월 표시 */}
          <span className="text-head-06 w-[50px] text-center text-neutral-1">
            2025.{displayMonth}
          </span>

          {/* 다음 월 버튼 (현재 월이면 숨김) */}
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

      {/* 거래내역 리스트 영역 */}
      <div
        ref={listRef}
        className="flex-1 mt-[3px] overflow-y-auto px-[20px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {currentTransactions.length > 0 ? (
          <div className="space-y-0">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() =>
                  alert(`${transaction.merchant} / ${transaction.amount}원`)
                }
                className="flex h-[76px] items-center justify-between border-b border-monochrome-gray last:border-b-0"
              >
                {/* 거래 정보 (왼쪽) */}
                <div className="flex items-center gap-[12px]">
                  {/* 거래 유형 표시 점 (입금: 초록색, 출금: 붉은색) */}
                  <div
                    className={`h-[12px] w-[12px] rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-chart-3"
                        : "bg-chart-10"
                    }`}
                  />
                  <div>
                    {/* 거래처명 */}
                    <p className="text-head-04 mb-[5px] text-neutral-1">
                      {transaction.merchant}
                    </p>
                    {/* 거래 시각 */}
                    <p className="text-body-07 text-neutral-3">
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>

                {/* 금액 정보 (오른쪽) */}
                <div className="text-right">
                  {/* 거래 금액 */}
                  <p className="text-head-08 mb-[5px] text-neutral-1">
                    {formatAmount(transaction.amount)}
                  </p>
                  {/* 거래 후 잔액 */}
                  <p className="text-body-07 text-neutral-3">
                    {formatAmount(transaction.balanceAfter)}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 거래 내역이 없을 때 표시되는 메시지
          <p className="text-center text-body-06 text-neutral-2 py-10">
            거래 내역이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
