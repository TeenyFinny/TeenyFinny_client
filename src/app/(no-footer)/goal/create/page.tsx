"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog" // ✅ 모달 import

export default function GoalSettingPage() {
  const router = useRouter()

  const [goalName, setGoalName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [monthlyAmount, setMonthlyAmount] = useState("")
  const [savingDay, setSavingDay] = useState("1")
  const [calculatedMonths, setCalculatedMonths] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // ✅ 모달 열림 상태

  useEffect(() => {
    const total = Number.parseInt(totalAmount.replace(/,/g, "")) || 0
    const monthly = Number.parseInt(monthlyAmount.replace(/,/g, "")) || 0
    if (monthly > 0) {
      setCalculatedMonths(Math.ceil(total / monthly))
    } else {
      setCalculatedMonths(0)
    }
  }, [totalAmount, monthlyAmount])

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, "")
    return number === "" ? "" : Number(number).toLocaleString()
  }

  const isAllFilled =
    goalName.trim() !== "" &&
    totalAmount.trim() !== "" &&
    monthlyAmount.trim() !== "" &&
    savingDay.trim() !== ""

  // ✅ “확인” 버튼 클릭 시 페이지 이동
  const handleConfirm = () => {
    router.push("/home")
  }

  return (
    <div className="flex h-[712px] flex-col bg-primary-4">
      <main className="flex flex-col overflow-visible px-6">
        <div className="mt-[51px]">
          <h1 className="text-head-01 text-neutral-1">목표를 설정해주세요</h1>
          <p className="mt-3 mb-[0.6px] text-body-05 text-neutral-3">
            이룰 수 있는 목표를 신중하게 설정하여
            <br />
            끝까지 티니피니와 함께 달려요!
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <NormalInput2
            label="적금 이름을 지어주세요"
            placeholder="현징이의 더현대 적금"
            value={goalName}
            onChange={setGoalName}
          />

          <NormalInput2
            label="총 얼마를 모을까요?"
            placeholder="325,000"
            value={totalAmount}
            onChange={(value) => {
              setTotalAmount(formatNumber(value))
            }}
            isNumeric
            unit="원"
          />

          <NormalInput2
            label="한 달에 얼마를 모을까요?"
            placeholder="10,000"
            value={monthlyAmount}
            onChange={(value) => {
              setMonthlyAmount(formatNumber(value))
            }}
            isNumeric
            unit="원"
          />

          <NormalInput2
            label="언제 저금할까요?"
            value={savingDay}
            placeholder="1"
            onChange={setSavingDay}
            unit="일"
            min={1}
            max={31}
            step={1}
          />
        </div>

        {/* ✅ 계산 결과 */}
        <div className="mt-6 pt-[0.2px] text-right h-[24px] transition-opacity duration-300">
          {calculatedMonths > 0 ? (
            <p className="text-head-08 text-neutral-2">
              그럼{" "}
              <span className="text-head-01 text-primary-2">
                {calculatedMonths}
              </span>
              달이 걸려요
            </p>
          ) : (
            <p className="text-head-08 text-neutral-2 opacity-0 select-none">
              그럼 0달이 걸려요
            </p>
          )}
        </div>

        {/* ✅ 버튼 */}
        <div className="mt-[59.5px] flex justify-center">
          {isAllFilled ? (
            <BigButtonActivated
              label="부모님께 허락 받기"
              onClick={() => setIsDialogOpen(true)} // ✅ 모달 열기
            />
          ) : (
            <BigButtonDisabled label="부모님께 허락 받기" onClick={() => { }} />
          )}
        </div>
      </main>

      {/* ✅ 모달 */}
      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="부모님께 알림을 보냈어요!"
        description={
          (
            <>
              부모님이 목표 계좌 생성을<br />
              허락할 때까지 기다려요
            </>
          ) as unknown as string
        }
        confirmText="확인"
        onConfirm={handleConfirm} // ✅ 확인 시 /home 이동
      />
    </div>
  )
}
