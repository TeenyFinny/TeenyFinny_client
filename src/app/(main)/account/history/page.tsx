"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { StateBadge } from "@/components/ui/badge/StateBadge";
import { BottomSheetDetail } from "@/components/custom/account/BottomSheetDetail";
import { useSearchParams, useRouter } from "next/navigation";
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
  /** 유저 타입 (parent/child) */
  const { userType } = useUserStore();

  /** 라우터 & URL Params */
  const params = useSearchParams();
  const router = useRouter();

  const childId = params.get("childId");
  const accountType = params.get("account");

  /** 헤더 정보(Zustand) */
  const { childName, accountName, balance } = useAccountHistoryStore();

  /** 현재 월 지정 */
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /** 거래 상세 바텀시트 */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  /** 월 파싱 */
  const [year, month] = currentMonth.split("-").map(Number);

  /* ----------------------------
   *  월 이동 (이전/다음 버튼)
   * ---------------------------- */
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

  /* ----------------------------
   *  거래내역 API 호출 (childId, accountType, currentMonth 변경 시)
   * ---------------------------- */
  useEffect(() => {
    if (!childId || !accountType) return;

    const [yearStr, monthStr] = currentMonth.split("-");

    const fetchHistory = async () => {
      const res = await api.get(requests.fetchAccountHistory, {
        params: {
          childId: Number(childId),
          accountType,
          year: yearStr,
          month: monthStr,
        },
      });

      setTransactions(res.data);
    };

    fetchHistory();
  }, [childId, accountType, currentMonth]);

  /* ----------------------------
   *  URL 자동 업데이트 (replace)
   * ---------------------------- */
  useEffect(() => {
    if (!childId || !accountType) return;

    const [yearStr, monthStr] = currentMonth.split("-");

    router.replace(
      `/account/history?childId=${childId}&account=${accountType}&year=${yearStr}&month=${monthStr}`
    );
  }, [currentMonth, childId, accountType, router]);

  /* ----------------------------
   *  거래 상세 클릭 → 상세 API 요청
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

        {/* 월 네비게이터 */}
        <div className="mx-[20px] mt-[36px] flex justify-between items-center">
          {/* 이전 월 */}
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

          {/* 다음 월 */}
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

      {/* 거래 내역 리스트 */}
      <div className="flex-1 mt-[3px] overflow-y-auto px-[20px]">
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
                <p className="text-body-07 text-neutral-3">{t.balanceAfter}원</p>
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
