"use client";
import AboutBanner from "../AboutBanner";
import ParentWalletCard from "./ParentWalletCard";
import AddChildCard from "./AddChildCard";
import ChildrenCarousel from "./ChildrenCarousel";
import type { ChildSummary } from "@/lib/utils/userMapper";

interface ParentDashboardProps {
  readonly hasChildren: boolean;
  readonly balance: number;
  readonly childAccounts: ChildSummary[];
}

/**
 * 부모 대시보드 최상위 레이아웃.
 *
 * @param {ParentDashboardProps} props - 대시보드 데이터.
 * @param {boolean} props.hasChildren - 자녀 계좌 존재 여부.
 * @param {number} props.balance - 부모 계좌 잔액.
 * @param {ChildSummary[]} props.childAccounts - 표시할 자녀 계좌 목록.
 * @returns {JSX.Element} 부모 대시보드 섹션.
 */
export default function ParentDashboard({
  hasChildren,
  balance,
  childAccounts,
}: ParentDashboardProps) {
  return (
    <main className="flex flex-col gap-6">
      <AboutBanner />
      <ParentWalletCard balance={balance} />

      {hasChildren ? (
        <ChildrenCarousel childAccounts={childAccounts} />
      ) : (
        <AddChildCard />
      )}
    </main>
  );
}
