"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StockPurchaseBottomSheet } from "@/components/ui/bottom-sheet/StockPurchaseSheet"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<string>("")

  // 테스트용 주식 정보
  const stockPrice = 280000
  const availableFunds = 1000000
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
    <main className="flex min-h-screen items-center justify-center bg-[#F6F7F8] p-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-head-01 text-[#000000]">주식 구매 모달 테스트</h1>
          <div className="text-body-05 text-[#898989] space-y-1">
            <p>주식 가격: {stockPrice.toLocaleString("ko-KR")}원</p>
            <p>구매 가능 금액: {availableFunds.toLocaleString("ko-KR")}원</p>
            <p>최대 구매 수량: {maxQuantity}주</p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0067ac] hover:bg-[#005a94] text-[#ffffff] px-8 py-6 text-body-04"
        >
          주식 구매하기
        </Button>

        {purchaseResult && (
          <div className="mt-6 p-4 rounded-lg bg-[#E8EBEE]">
            <p className="text-body-05 text-[#343434] whitespace-pre-line">{purchaseResult}</p>
          </div>
        )}
        <StockPurchaseBottomSheet
          open={isModalOpen}
          setOpen={setIsModalOpen}
          price={stockPrice}
          availableFunds={availableFunds}
          maxQuantity={maxQuantity}
          onConfirm={handlePurchaseConfirm}
          onCancel={handleCancel}
        />
      </div>
    </main>
  )
}
