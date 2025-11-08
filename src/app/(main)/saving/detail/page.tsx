"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TransactionHistory } from "@/components/ui/tx-history-ui/TransactionHistory"
import { useUserStore } from "@/store/userStore"

interface GoalSaving {
  goal_id: number
  user_id: number
  name: string
  target_amount: number
  current_amount: number
  period: number
  progress: number
  user_name: string
  deposit_amount: number[]
  deposit_datetime: string[]
}

export default function SavingsDetailScreen({
  onDelete,
  onEdit,
}: {
  onDelete?: () => void
  onEdit?: () => void
}) {
  const [goal, setGoal] = useState<GoalSaving | null>(null)
  const [transactions, setTransactions] = useState<
    { id: string; type: string; amount: number; date: string }[]
  >([])

  // ✅ zustand로부터 userType 가져오기
  const userType = useUserStore((state) => state.userType)

  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch(
          "https://6972bba9-74a6-4c1f-a83a-dd9fc50a8a8b.mock.pstmn.io/saving/detail"
        )
        const json = await res.json()
        const data: GoalSaving = json.data
        setGoal(data)

        const tx = data.deposit_amount.map((amount, idx) => ({
          id: String(idx + 1),
          type: `${data.user_name} 입금`,
          amount: amount,
          date: data.deposit_datetime[idx],
        }))
        setTransactions(tx)
      } catch (err) {
        console.error(err)
      }
    }

    fetchGoal()
  }, [])

  if (!goal) return <div className="text-center mt-10">로딩중...</div>

  return (
    <div className="w-[375px] mx-auto min-h-screen flex flex-col">
      {/* Title Section */}
      <div className="px-6 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-head-02 text-primary-1">{goal.name}</h1>

            {/* ✅ userType이 parent가 아닐 때만 버튼 표시 */}
            {userType !== "parent" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neutral-2 p-0"
                  onClick={onDelete}
                >
                  <Image
                    src="/icons/trashbin-small.png"
                    alt="삭제"
                    width={20}
                    height={20}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neutral-2 p-0"
                  onClick={onEdit}
                >
                  <Image
                    src="/icons/edit-small.png"
                    alt="수정"
                    width={20}
                    height={20}
                  />
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-body-02 text-neutral-3">
              {goal.current_amount.toLocaleString()} (원)
            </span>
            <span className="text-body-02 text-neutral-3">/</span>
            <span className="text-body-02 text-neutral-3">
              {goal.target_amount.toLocaleString()} (원)
            </span>
          </div>
        </div>

        <p className="text-body-05 text-neutral-2 mt-2">
          {goal.period.toLocaleString()}달째 꾸준히 모으고 있어요!
        </p>
      </div>

      {/* ✅ Progress Section */}
      <div className="flex flex-col items-center px-6 mt-6.5">
        <div className="w-full max-w-[300px] relative">
          {/* 🧩 토끼 + 포인터 + % 묶음 그룹 */}
          <div
            className="absolute flex flex-col items-center transition-all duration-300 z-10"
            style={{
              left: `calc(${goal.progress}%)`,
              transform: "translateX(-50%)",
              top: "5px",
            }}
          >
            {/* 🐰 토끼 */}
            <div
              style={{
                width: "68px",
                height: "auto",
                marginBottom: "-12px",
              }}
            >
              <img
                src="/images/saving/illust_saving_run.png"
                alt="Savings character"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* 📍 포인터 */}
            <img
              src="/images/saving/illust_saving_pointer.png"
              alt="Progress pointer"
              style={{
                width: "26px",
                height: "auto",
                objectFit: "contain",
                marginBottom: "2px",
              }}
            />

            {/* 🔢 진행률 */}
            <span
              className="text-head-04 text-neutral-2"
              style={{
                fontFamily: "Pretendard",
                fontWeight: 700,
                letterSpacing: "-0.6px",
              }}
            >
              {goal.progress}%
            </span>
          </div>

          {/* 🌈 Progress Bar */}
          <div className="relative h-[11px] rounded-full overflow-visible mt-[73px]">
            <div className="absolute inset-0 rounded-full bg-monochrome-gray" />
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 overflow-hidden"
              style={{
                width: `${goal.progress}%`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, #F7F9A7 0%, #7DD3C0 50%, #20C4F4 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex-1 pb-6 mt-[80px]">
        <h2 className="text-head-04 text-neutral-1 mb-1.5 text-center">
          적금 기록
        </h2>

        <div>
          {transactions
            .slice()
            .reverse()
            .map((tx) => (
              <TransactionHistory
                key={tx.id}
                transactionName={tx.type}
                time={tx.date}
                Price={tx.amount.toLocaleString()}
                isDeposit={false}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
