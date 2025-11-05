"use client"

import { useState } from "react"
import { StockPurchaseSheet } from "@/components/ui/bottom-sheet/StockPurchaseSheet"

/**
 * StockPurchaseSheet 컴포넌트 테스트 페이지
 *
 * 이 페이지는 StockPurchaseSheet 컴포넌트의 동작을 테스트하기 위한 페이지입니다.
 * 버튼을 클릭하면 바텀시트가 열리고, 구매/취소 버튼을 클릭하면 alert가 표시됩니다.
 */
export default function StockPurchaseTest() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-neutral-6)">
      

      <StockPurchaseSheet
        purchasePrice={280000}
        expectedPrice={281000}
        availableAmount={0}
        maxQuantity={0}
      />
    </div>
  )
}
