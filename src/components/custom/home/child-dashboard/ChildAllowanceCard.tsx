"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { TinyStateBadge } from "@/components/ui/badge/TinyStateBadge";

interface ChildAllowanceCardProps {
  /** 계좌 이름 */
  accountName: string;
  /** 계좌 잔액 */
  balance: string;
  /** 카드 표시 여부 */
  showCard?: boolean;
  /** 상세 내역 보기 클릭 핸들러 */
  onViewDetails?: () => void;
  /** 카드 버튼 클릭 핸들러 */
  onCardClick?: () => void;
}

/**
 * ChildAllowanceCard
 *
 * 자녀 대시보드에서 사용하는 계좌 카드 컴포넌트입니다.
 * ChildrenCarousel과 동일한 크기와 스타일을 사용합니다.
 */
export default function ChildAllowanceCard({
  accountName,
  balance,
  showCard = false,
  onViewDetails,
  onCardClick,
}: ChildAllowanceCardProps) {
  const isAccountEmpty = balance === "-1";
  const formattedBalance = isAccountEmpty
    ? "아직 개설된 계좌가 없어요"
    : `${balance} 원`;

  return (
    <div className="relative flex min-w-full flex-col gap-4 select-none rounded-2xl bg-mint-flash p-6 h-[217px]">
      {/* 계좌명과 카드 뱃지 */}
      <div className="flex items-start justify-between">
        <div className="text-body-05 text-neutral-3">{accountName}</div>
        {showCard && (
          <TinyStateBadge
            enabled={true}
            label="카드"
            onClick={() => onCardClick?.()}
          />
        )}
      </div>

      {/* 잔액 */}
      <div
        className={
          isAccountEmpty
            ? "text-body-08 text-neutral-3 leading-[22px] tracking-[-0.6px]"
            : "text-head-00 text-neutral-1"
        }
      >
        {formattedBalance}
      </div>

      {/* 저금통 이미지 */}
      <div className="absolute right-8 top-12 flex h-24 w-24 items-center justify-center rounded-full overflow-hidden bg-pale-green">
        <Image
          src="/images/allowance/piggybank.svg"
          alt="저금통"
          width={96}
          height={96}
          className="object-contain"
        />
      </div>

      {/* 상세 내역 보기 버튼 */}
      {onViewDetails && !isAccountEmpty && (
        <button
          className="mt-auto flex items-center justify-end gap-1"
          onClick={onViewDetails}
        >
          <span className="text-body-02 text-primary-1">상세 내역 보기</span>
          <ChevronRight className="size-5 text-primary-1" />
        </button>
      )}
    </div>
  );
}
