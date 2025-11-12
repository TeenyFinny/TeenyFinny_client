"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TransactionHistory } from "@/components/ui/tx-history-ui/TransactionHistory"
import { useUserStore } from "@/store/userStore"
import { useRouter } from "next/navigation"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { HttpError } from "@/types/axios/httpError.t"

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

export default function SavingsDetailScreen() {
  const router = useRouter()
  const [goal, setGoal] = useState<GoalSaving | null>(null)
  const [transactions, setTransactions] = useState<
    { id: string; type: string; amount: number; date: string }[]
  >([])

  const userType = useUserStore((state) => state.userType)

  const handleDelete = () => router.push("/goal/delete")
  const handleEdit = () => router.push("/goal/edit")

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const res = await api.get(requests.fetchGoal, {
          signal: controller.signal,
        })

        const data: GoalSaving = res.data
        if (!data) throw new Error("데이터가 비어 있습니다.")
        setGoal(data)

        const tx = data.deposit_amount.map((amount, idx) => ({
          id: String(idx + 1),
          type: `${data.user_name} 입금`,
          amount,
          date: data.deposit_datetime[idx],
        }))
        setTransactions(tx)
      } catch (e) {
        const err = e as HttpError
        console.error("[GOAL] 데이터 요청 실패:", err)
        if (err.statusCode === 403) {
          alert(err.message)
          router.push("/")
        }
      }
    })()

    return () => controller.abort()
  }, [router])

  if (!goal) return <div className="text-center mt-10">로딩중...</div>

  return (
    <div className="w-[375px] mx-auto flex-1 flex flex-col">
      {/* Title Section */}
      <div className="px-6 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-head-02 text-primary-1">{goal.name}</h1>

            {userType !== "parent" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neutral-2 p-0"
                  onClick={handleDelete}
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
                  onClick={handleEdit}
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

      {/* Progress Section */}
      <div className="flex flex-col items-center px-6 mt-6.5">
        <div className="w-full max-w-[300px] relative">
          <div
            className="absolute flex flex-col items-center transition-all duration-300 z-10"
            style={{
              left: `calc(${goal.progress}%)`,
              transform: "translateX(-50%)",
              top: "5px",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "auto",
                marginBottom: "-12px",
              }}
            >
              <Image
                src="/images/saving/illust_saving_run.png"
                alt="Savings character"
                width={68}
                height={68}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            <Image
              src="/images/saving/illust_saving_pointer.png"
              alt="Progress pointer"
              width={26}
              height={34}
              style={{
                width: "26px",
                height: "auto",
                objectFit: "contain",
                marginBottom: "2px",
              }}
            />

            <span className="text-head-04 text-neutral-2">
              {goal.progress}%
            </span>
          </div>

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
      <div className="flex-1 mt-[80px]">
        <h2 className="text-head-03 text-neutral-1 mb-1.5 text-center">
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