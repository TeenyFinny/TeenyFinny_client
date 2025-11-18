"use client"

import { useState, useEffect } from "react"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { HttpError } from "@/types/axios/httpError.t"

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

  // 목표 데이터 불러오기
  useEffect(() => {
    const controller = new AbortController();

    const fetchGoalData = async () => {
      try {
        const res = await api.get(requests.fetchGoalConfirm, {
          signal: controller.signal,
        });

        // 🚨 res 가 null이면 (abort된 상황), 바로 return 하여 이후 코드 실행 방지
        if (res === null) return;

        const data: GoalData = res.data;
        if (!data) throw new Error("데이터가 비어 있습니다.");

        setGoalData(data);
      } catch (e) {
        // ❗ abort는 이미 return 했기 때문에 여기 e는 abort가 아님
        console.error("❌ [GOAL] 데이터 로드 실패:", e);
      }
    };

    fetchGoalData();
    return () => controller.abort();
  }, []);


  // 목표 기간 계산
  useEffect(() => {
    if (!goalData) return

    const total = Number(goalData.totalAmount.replace(/,/g, "")) || 0
    const monthly = Number(goalData.monthlyAmount.replace(/,/g, "")) || 0

    setCalculatedMonths(monthly > 0 ? Math.ceil(total / monthly) : 0)
  }, [goalData])

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
        {/* 제목 */}
        <div className="mt-[51px]">
          <h1 className="text-head-01 text-neutral-1">자녀의 목표를 확인하세요</h1>
          <p className="mt-3 mb-[0.6px] text-body-05 text-neutral-3">
            자녀가 설정한 목표 정보를 확인한 뒤<br />
            계좌 개설을 완료해 주세요.
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="mt-10 space-y-6">
          <NormalInput2
            label="적금 이름"
            value={goalData.goalName}
            onChange={() => { }}
            disabled
          />
          <NormalInput2
            label="총 얼마를 모을까요?"
            value={`${goalData.totalAmount} 원`}
            onChange={() => { }}
            disabled
            isNumeric
          />
          <NormalInput2
            label="한 달에 얼마를 모을까요?"
            value={`${goalData.monthlyAmount} 원`}
            onChange={() => { }}
            disabled
            isNumeric
          />
          <NormalInput2
            label="언제 저금할까요?"
            value={`${goalData.payDay} 일`}
            onChange={() => { }}
            disabled
            isNumeric
          />
        </div>

        {/* 계산 결과 */}
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

        {/* 버튼 */}
        <div className="absolute bottom-14 flex">
          <BigButtonActivated label="목표 적금 생성하기" onClick={onNext} />
        </div>
      </main>
    </div>
  )
}
