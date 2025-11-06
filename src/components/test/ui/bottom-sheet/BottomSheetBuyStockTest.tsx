"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BottomSheetBuyStock } from "@/components/ui/bottom-sheet/BottomSheetBuyStock"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<string>("")

  // 테스트용 주식 정보
  const stockPrice = 280000
  const availableStock = 1000000
  const maxQuantity = 3

  const handlePurchaseConfirm = (quantity: number) => {
    const totalPrice = quantity * stockPrice
    setPurchaseResult(`${quantity}주를 ${totalPrice.toLocaleString("ko-KR")}원에 구매했습니다!`)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setPurchaseResult("구매를 취소했습니다.")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-monochrome-lightgray) p-8">
      <div className="text-center space-y-6">
        {/* 타이틀 영역 */}
        <div className="space-y-2">
          <h1 className="text-head-01 text-(--color-neutral-1)">주식 구매 모달 테스트</h1>
          <div className="text-body-05 text-(--color-neutral-2) space-y-1">
            <p>주식 가격: {stockPrice.toLocaleString("ko-KR")}원</p>
            <p>구매 가능 금액: {availableStock.toLocaleString("ko-KR")}원</p>
            <p>최대 구매 수량: {maxQuantity}주</p>
          </div>
        </div>

        {/* 버튼 */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary-1)] text-[var(--color-neutral-6)] hover:bg-[#005a94]"
        >
          주식 구매하기
        </Button>

        {/* 구매 결과 */}
        {purchaseResult && (
          <div className="mt-6 p-4 rounded-[12px] bg-(--color-monochrome-gray)">
            <p className="text-body-05 text-(--color-neutral-1) whitespace-pre-line">
              {purchaseResult}
            </p>
          </div>
        )}

        {/* 바텀시트 */}
        <BottomSheetBuyStock
          open={isModalOpen}
          setOpen={setIsModalOpen}
          price={stockPrice}
          availableStocks={availableStock}
          maxQuantity={maxQuantity}
          onConfirm={handlePurchaseConfirm}
          onCancel={handleCancel}
        />
      </div>
    </main>
  )
}
