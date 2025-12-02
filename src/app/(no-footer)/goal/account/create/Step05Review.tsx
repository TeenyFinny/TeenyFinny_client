"use client"

import { useState, useEffect } from "react"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { useRouter, useSearchParams } from "next/navigation"

interface GoalData {
  goalName: string
  totalAmount: string
  monthlyAmount: string
  payDay: string
}

interface Step05ReviewProps {
  onNext: () => void
}

export default function Step05Review({ onNext }: Step05ReviewProps) {
  const [goalData, setGoalData] = useState<GoalData | null>(null)
  const [calculatedMonths, setCalculatedMonths] = useState(0)

  const searchParams = useSearchParams()
  const goalId = searchParams.get("goalId")

  const router = useRouter()

  // 목표 데이터 불러오기
  useEffect(() => {
    if (!goalId || goalId === "null") {
      console.error("goalId가 없습니다. URL에 ?goalId=값 이 있어야 합니다.")
      return
    }

    const fetchGoalData = async () => {
      try {
        const res = await api.get(requests.fetchGoalConfirm(goalId))

        const raw = res.data

        const formatted: GoalData = {
          goalName: raw.name,
          totalAmount: raw.targetAmount,
          monthlyAmount: raw.monthlyAmount,
          payDay: String(raw.payDay),
        }

        setGoalData(formatted)
      } catch (e) {
        console.error("❌ [GOAL] 데이터 로드 실패:", e)
      }
    }

    fetchGoalData()
  }, [goalId])

  // 목표 기간 계산
  useEffect(() => {
    if (!goalData) return

    const total = Number((goalData.totalAmount || "0").replace(/,/g, ""))
    const monthly = Number((goalData.monthlyAmount || "0").replace(/,/g, ""))

    setCalculatedMonths(monthly > 0 ? Math.ceil(total / monthly) : 0)
  }, [goalData])

  const handleApprove = async () => {
    if (!goalId || goalId === "null") {
      alert("goalId가 없습니다.");
      return;
    }

    try {
      await api.patch(
        requests.approveGoal(goalId),
        { approve: true }
      );

      onNext()

    } catch (e) {
      console.error("승인 요청 실패:", e);
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  }

  if (!goalData) {
    return (
      <div className="flex h-[712px] flex-col items-center justify-center bg-primary-4">
        로딩중...
      </div>
    )
  }

  return (
    <div className="flex h-[712px] flex-col bg-primary-4">
      <main className="flex flex-col overflow-hidden px-6">
        <div className="mt-[51px]">
          <h1 className="text-head-01 text-neutral-1">자녀의 목표를 확인하세요</h1>
          <p className="mt-3 mb-[0.6px] text-body-05 text-neutral-3">
            자녀가 설정한 목표 정보를 확인한 뒤<br />
            계좌 개설을 완료해 주세요.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <NormalInput2 label="적금 이름" value={goalData.goalName} disabled onChange={() => { }} />
          <NormalInput2 label="총 얼마를 모을까요?" value={`${goalData.totalAmount} 원`} disabled isNumeric onChange={() => { }} />
          <NormalInput2 label="한 달에 얼마를 모을까요?" value={`${goalData.monthlyAmount} 원`} disabled isNumeric onChange={() => { }} />
          <NormalInput2 label="언제 저금할까요?" value={`${goalData.payDay} 일`} disabled isNumeric onChange={() => { }} />
        </div>

        {calculatedMonths > 0 && (
          <div className="mt-6 pb-[0.2px] text-right">
            <p className="text-head-08 text-neutral-2">
              자녀의 목표는{" "}
              <span className="text-head-01 text-primary-2">
                {calculatedMonths}
              </span>
              달 동안 진행돼요
            </p>
          </div>
        )}

        <div className="absolute bottom-14 flex">
          <BigButtonActivated label="목표 적금 생성하기" onClick={handleApprove} />
        </div>
      </main>
    </div>
  )
}
