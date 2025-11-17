"use client";

import AboutBanner from "../AboutBanner";
import { AccountCard } from "@/components/custom/account/AccountCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 사용자 데이터 타입
 */
interface UserData {
  userId: number;
  name: string;
  role: string;
  email: string;
  totalBalance: number;
  depositBalance: number;
  investmentBalance: number;
  savingBalance: number;
}

/**
 * ChildDashboard 컴포넌트 props
 */
interface ChildDashboardProps {
  data: {
    user: UserData;
  };
}

/**
 * 자녀 대시보드 컴포넌트
 *
 * 사용자의 계좌 요약과 카드/상세보기 버튼, 소비 리포트 버튼을 렌더링합니다.
 *
 * @param {ChildDashboardProps} props - 대시보드 데이터
 * @returns {JSX.Element} 자녀 대시보드 화면
 *
 * @example
 * ```tsx
 * const data = {
 *   user: {
 *     user_id: 2,
 *     name: "김티니",
 *     role: "CHILD",
 *     email: "child@teenyfinny.com",
 *     total_balance: 10000,
 *     deposit_balance: 1000,
 *     investment_balance: 0,
 *     saving_balance: 9000
 *   }
 * };
 *
 * <ChildDashboard data={data} />
 * ```
 */
export default function ChildDashboard({ data }: ChildDashboardProps) {
  const { user } = data;
  const userId = user.userId;

  /**
   * 상세 내역 보기 클릭 이벤트
   *
   * @param {string} accountName - 클릭한 계좌 이름
   */
  const handleViewDetails = (accountName: string) => {
    console.log(`(id=${userId})인 아이의 ${accountName} 상세 내역 보기`);
  };

  /**
   * 카드 뱃지 클릭 이벤트
   */
  const handleViewCard = () => {
    console.log(`(id=${userId})인 아이의 카드 바텀시트 리다이렉트`);
  };

  /**
   * 리포트 페이지 이동 이벤트
   */
  const reportHandler = () => {
    console.log(`(id=${userId})인 아이의 리포트 페이지와 리다이렉트`);
  };

  return (
    <div className="max-h-screen px-[17px]">
      <div className="max-w-md mx-auto space-y-3">
        {/* 배너 */}
        <div className="flex flex-col gap-6">
          <AboutBanner />
        </div>

        {/* 계좌 제목 */}
        <div className="h-[21px] flex justify-between items-center">
          <p className="text-head-03 font-bold text-neutral-3 mb-[10px] mt-[20px]">
            {user.name}의 계좌
          </p>
        </div>

        {/* 총 잔액 */}
        <div className="text-head-00 font-bold text-neutral-1 mb-5">
          {user.totalBalance} 원
        </div>

        {/* 계좌 카드: 용돈 계좌 */}
        <AccountCard
          accountName="용돈 계좌"
          balance={user.depositBalance}
          showCard={true}
          onViewDetails={() => handleViewDetails("용돈 계좌")}
          onCardClick={() => handleViewCard()}
        />

        {/* 계좌 카드: 투자 계좌 */}
        <AccountCard
          accountName="투자 계좌"
          balance={user.investmentBalance}
          onViewDetails={() => handleViewDetails("투자 계좌")}
          onCardClick={() => null}
        />

        {/* 계좌 카드: 목표 적금 */}
        <AccountCard
          accountName="목표 적금"
          balance={user.savingBalance}
          onViewDetails={() => handleViewDetails("목표 적금")}
          onCardClick={() => null}
        />

        {/* 소비 리포트 버튼 */}
        <button
          className="flex justify-start w-[335px] h-[48px] border-1 border-monochrome-gray
                     bg-neutral-7 rounded-4xl text-body-04 items-center mt-0"
          onClick={() => reportHandler()}
        >
          <img
            src="/images/account/illust_account_report.png"
            alt="리포트 아이콘"
            className="ml-[12px] mr-[7px] w-[40px] h-[40px]"
          />
          소비 리포트 보러가기
        </button>
      </div>
    </div>
  );
}
