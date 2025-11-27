"use client";
import AboutBanner from "../AboutBanner";
import ParentWalletCard from "./ParentWalletCard";
import ChildrenCarousel from "./ChildrenCarousel";
import type { ChildSummary } from "@/types/user";

interface ParentDashboardProps {
  readonly balance: string;
  readonly childAccounts: ChildSummary[];
}

/**
 * 부모 대시보드 최상위 레이아웃.
 *
 * @param {ParentDashboardProps} props - 대시보드 데이터.
 * @param {number} props.balance - 부모 계좌 잔액.
 * @param {ChildSummary[]} props.childAccounts - 표시할 자녀 계좌 목록.
 * @returns {JSX.Element} 부모 대시보드 섹션.
 */
export default function ParentDashboard({
  balance,
  childAccounts,
}: ParentDashboardProps) {
  return (
    <main className="flex flex-col gap-6">
      <AboutBanner />
      <ParentWalletCard balance={balance} />
      <ChildrenCarousel childAccounts={childAccounts} />
    </main>
  );
}
