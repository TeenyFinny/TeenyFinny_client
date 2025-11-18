"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated"
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

interface GoalData {
    goalName: string
    totalAmount: string
    monthlyAmount: string
    payDay: string
}

export default function GoalSettingPage() {
    const router = useRouter()

    const [goalData, setGoalData] = useState<GoalData | null>(null)
    const [payDay, setPayDay] = useState("")
    const [calculatedMonths, setCalculatedMonths] = useState(0)

    // 🔹 GET: 기존 목표 정보 로드
    useEffect(() => {
        const fetchGoalData = async () => {
            try {
                console.log("📡 목표 정보 불러오는 중...")

                const res = await api.get(requests.updateGoal)
                const raw = res.data?.data || res.data

                const mappedData: GoalData = {
                    goalName: raw.goalName,
                    totalAmount: Number(raw.totalAmount).toLocaleString(),
                    monthlyAmount: Number(raw.monthlyAmount).toLocaleString(),
                    payDay: raw.payDay,  // 🔥 여기 수정됨
                }

                console.log("✅ 변환된 GoalData:", mappedData)
                setGoalData(mappedData)
                setPayDay(mappedData.payDay)
            } catch (error) {
                console.error("❌ 목표 정보 불러오기 실패:", error)
            }
        }

        fetchGoalData()
    }, [])

    // 🔹 기간 계산
    useEffect(() => {
        if (!goalData) return
        const total = Number(goalData.totalAmount.replace(/,/g, "")) || 0
        const monthly = Number(goalData.monthlyAmount.replace(/,/g, "")) || 0
        setCalculatedMonths(monthly > 0 ? Math.ceil(total / monthly) : 0)
    }, [goalData])

    // 🔹 PATCH 요청 (수정)
    const handleSave = async () => {
        if (!payDay) return

        try {
            const payload = { payDay }

            console.log("📨 PATCH 요청 데이터:", payload)

            const res = await api.patch(requests.updateGoal, payload)

            console.log("✅ 수정 완료:", res.data)

            alert(`납입일이 ${payDay}일로 수정되었습니다!`)
            router.push("/goal")
        } catch (error) {
            console.error("❌ 수정 실패:", error)
        }
    }

    if (!goalData) {
        return (
            <div className="flex h-[712px] flex-col items-center justify-center bg-primary-4 text-neutral-1">
                불러오는 중...
            </div>
        )
    }

    return (
        <div className="flex h-[712px] flex-col bg-primary-4">
            <main className="flex flex-col overflow-visible px-6">
                <div className="mt-[51px]">
                    <h1 className="text-head-01 text-neutral-1">목표를 수정하시나요?</h1>
                    <p className="mt-3 mb-[0.6px] text-body-05 text-neutral-3">
                        매달 저금하는 날짜만 바꿀 수 있다는 점
                        <br />
                        꼭 주의해 주세요!
                    </p>
                </div>

                <div className="mt-10 space-y-6">
                    <NormalInput2
                        label="적금 이름을 지어주세요"
                        value={goalData.goalName}
                        onChange={() => {}}
                        disabled
                    />

                    <NormalInput2
                        label="총 얼마를 모을까요?"
                        value={goalData.totalAmount}
                        onChange={() => {}}
                        disabled
                        isNumeric
                        unit="원"
                    />

                    <NormalInput2
                        label="한 달에 얼마를 모을까요?"
                        value={goalData.monthlyAmount}
                        onChange={() => {}}
                        disabled
                        isNumeric
                        unit="원"
                    />

                    <NormalInput2
                        label="언제 저금할까요?"
                        value={payDay}
                        onChange={setPayDay}
                        isNumeric
                        unit="일"
                    />
                </div>

                <div className="mt-6 text-right h-[24px] transition-opacity duration-300">
                    {calculatedMonths > 0 && (
                        <p className="text-head-08 text-neutral-2">
                            그럼{" "}
                            <span className="text-head-01 text-primary-2">{calculatedMonths}</span>
                            달이 걸려요
                        </p>
                    )}
                </div>

                <div className="mt-17 flex gap-2.5">
                    <SmallButtonDisabled label="취소" onClick={() => router.push("/goal")} />
                    <SmallButtonActivated label="수정" onClick={handleSave} />
                </div>
            </main>
        </div>
    )
}
