"use client"

import { ChevronRight } from "lucide-react"
import { TinyButton } from "../../ui/button/TinyButton"
import { TinyStateBadge } from "../../ui/badge/TinyStateBadge"

/**
 * AccountCard 컴포넌트
 *
 * 통장 정보를 표시하는 카드 컴포넌트입니다.
 * 통장 이름, 잔액, 카드 활성화 여부, 상세 내역 보기 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <AccountCard
 *   accountName="용돈 계좌"
 *   balance={10000}
 *   showCard={true}
 *   onViewDetails={() => console.log("View details")}
 * />
 * ```
 */

interface AccountCardProps {
  /** 통장 이름 */
  accountName: string
  /** 클릭 시 이벤트 */
  onCardClick: () => void
}

export function AccountCardDisabled({ accountName, onCardClick }: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("ko-KR")
  }

  return (
    <div className="relative w-[340px] rounded-[16px] px-[24px] py-[11px] bg-primary-1/[0.12] h-[111px]"
     onClick={onCardClick}>
      {/* 상단: 통장 이름과 카드 버튼 */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-body-05 text-neutral-2 leading-[17px] tracking-[-0.6px] whitespace-pre-line mt-[2px] pt-[13px]">
          {accountName}
        </h3>
      </div>

      {/* 잔액 */}
      <div className="mb-[10px] pt-[1px]">
        <p className="text-neutral-3 text-body-04 leading-[31px] font-bold tracking-[-0.6px] whitespace-pre-line">
          개설된 계좌가 없어요
        </p>
      </div>
    </div>
  )
}
