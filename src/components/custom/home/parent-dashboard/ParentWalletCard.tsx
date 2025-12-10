"use client";

import { MiddleButtonActivated } from "@/components/ui/button/MiddleButtonActivated";

interface ParentWalletCardProps {
  readonly balance: string;
}

/**
 * 부모 지갑 카드 컴포넌트.
 *
 * @param {ParentWalletCardProps} props - 카드에 전달되는 속성값.
 * @param {number} props.balance - 부모 지갑의 현재 잔액.
 * @returns {JSX.Element} 부모 지갑 카드 요소.
 */
export default function ParentWalletCard({ balance }: ParentWalletCardProps) {

  return (
    <div className="w-full h-[240px] bg-neutral-7 rounded-2xl px-6 pt-[26px] pb-[20px] flex flex-col shadow-lg">
      {/* Title Section */}
      <button
        className="flex items-center justify-between mb-[26px]"
        onClick={() => console.log("Navigate to parent wallet details")}
      >
        <span className="text-head-03 text-neutral-3">부모님의 지갑</span>
      </button>

      {/* Divider */}
      <div className="w-full h-px bg-neutral-4 mb-[22px]" />

      {/* Balance */}
      <div className="text-head-00 text-neutral-1 mb-[30px]">
        {balance} 원
      </div>

      {/* Send Money Button */}
      <div className="flex justify-center">
        <MiddleButtonActivated
          label="송금"
          onClick={() => console.log("Navigate to send money page")}
        />
      </div>
    </div>
  );
}
