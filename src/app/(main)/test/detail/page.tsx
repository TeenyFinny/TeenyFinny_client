"use client";

import { useState } from "react";
import { BottomSheetDetail } from "@/components/custom/account/BottomSheetDetail"; // 경로 맞게 변경
import type { DetailData } from "@/components/custom/account/BottomSheetDetail";

export default function TestPage() {
  const [open, setOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<DetailData | null>(null);

  // 여러 개 예시 데이터
  const details: DetailData[] = [
    {
      merchant: "스타벅스",
      amount: 4500,
      date: "2025.11.14 14:23:23",
      type: "일시불",
      category: "음료",
      approveAmount: 4500,
      balanceAfter: 120000,
    },
    {
      merchant: "이마트",
      amount: 32000,
      date: "2025.11.13 13:23:23",
      type: "일시불",
      category: "식료품",
      approveAmount: 32000,
      balanceAfter: 150000,
    },
    {
      merchant: "CGV",
      amount: 18000,
      date: "2025.11.12 15:23:54",
      type: "일시불",
      category: "문화/영화",
      approveAmount: 18000,
      balanceAfter: 132000,
    },
  ];

  return (
    <div className="p-8 flex flex-col gap-4">
      {details.map((detail, index) => (
        <button
          key={index}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            setSelectedDetail(detail); // 클릭한 데이터 설정
            setOpen(true); // 바텀시트 열기
          }}
        >
          {detail.merchant} 거래 보기
        </button>
      ))}

      {selectedDetail && (
        <BottomSheetDetail
          open={open}
          setOpen={setOpen}
          detail={selectedDetail}
          shouldOverlayBottomBar={true}
        />
      )}
    </div>
  );
}
