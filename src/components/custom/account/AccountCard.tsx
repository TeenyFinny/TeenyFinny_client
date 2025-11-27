"use client"

import { ChevronRight } from "lucide-react"
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
  /** 통장 잔액 */
  balance: string
  /** 카드 컴포넌트 표시 여부 */
  showCard?: boolean
  /** 상세 내역 보기 버튼 클릭 핸들러 */
  onViewDetails?: () => void
   /** 카드 버튼 클릭 핸들러 */
  onCardClick?: () => void
}

export function AccountCard({ accountName, balance, showCard = false, onViewDetails, onCardClick }: AccountCardProps) {
  return (
    <div className="relative w-[340px] rounded-[16px] px-[24px] py-[11px] bg-primary-1/[0.12] h-[111px]">
      {/* 상단: 통장 이름과 카드 버튼 */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-body-05 text-neutral-2 leading-[17px] tracking-[-0.6px] whitespace-pre-line mt-[2px] pt-[13px]">
          {accountName}
        </h3>
        {showCard && (
          // 카드 컴포넌트를 여기에 넣으세요
          <TinyStateBadge enabled={true} label="카드" onClick={() => onCardClick?.()} />
        )}
      </div>

      {/* 잔액 */}
      <div className="mb-[10px] pt-[1px]">
        {balance === "-1" ? (
          <p className="text-body-04 text-neutral-3 leading-[22px] tracking-[-0.6px] whitespace-pre-line">
            아직 개설된 계좌가 없어요
          </p>
        ) : (
          <p className="text-neutral-1 text-[26px] leading-[31px] font-bold tracking-[-0.6px] whitespace-pre-line">
            {balance} 원
          </p>
        )}
      </div>

      {/* 상세 내역 보기 버튼 */}
      <button
        onClick={onViewDetails}
        className="absolute right-4 bottom-4 inline-flex items-center justify-end gap-1 h-[22px] w-[100px] py-[1px]"
        type="button"
      >
        <span className="text-body-01 text-primary-1 leading-[17px] group-hover:text-primary-2 transition-colors whitespace-pre-line">
          상세 내역 보기
        </span>
        <ChevronRight className="w-5 h-5 text-primary-1 group-hover:text-primary-2 transition-colors" />
      </button>
    </div>
  )
}
