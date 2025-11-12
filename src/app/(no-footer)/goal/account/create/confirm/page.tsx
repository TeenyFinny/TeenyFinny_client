"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { HttpError } from "@/types/axios/httpError.t"

interface GoalData {
    goalName: string
    totalAmount: string
    monthlyAmount: string
    savingDay: string
}

export default function GoalSettingReviewPage() {
    const router = useRouter()
    const [goalData, setGoalData] = useState<GoalData | null>(null)
    const [calculatedMonths, setCalculatedMonths] = useState(0)

    // ✅ 목표 데이터 불러오기
    useEffect(() => {
        const controller = new AbortController()

        const fetchGoalData = async () => {
            try {
                const res = await api.get(requests.fetchGoalConfirm, {
                    signal: controller.signal,
                })

                // ✅ mock 서버는 "data"로 감싸서 반환됨
                const data: GoalData = res.data
                if (!data) throw new Error("데이터가 비어 있습니다.")
                setGoalData(data)
            } catch (e) {
                const err = e as HttpError
                console.error("❌ [GOAL] 데이터 로드 실패:", err)
            }
        }

        fetchGoalData()
        return () => controller.abort()
    }, [])


    // ✅ 목표 기간 계산
    useEffect(() => {
        if (!goalData) return
        const total = Number.parseInt(goalData.totalAmount.replace(/,/g, "")) || 0
        const monthly = Number.parseInt(goalData.monthlyAmount.replace(/,/g, "")) || 0
        if (monthly > 0) {
            setCalculatedMonths(Math.ceil(total / monthly))
        } else {
            setCalculatedMonths(0)
        }
    }, [goalData])

    const handleConfirm = () => {
        router.push("/goal/account/create/complete")
    }

    // ✅ 에러 처리
    if (!goalData) {
        return (
            <div className="flex h-[712px] flex-col items-center justify-center bg-primary-4">
                로딩중 ...
            </div>
        )
    }

    // ✅ 메인 렌더링
    return (
        <div className="flex h-[712px] flex-col bg-primary-4">
            <main className="flex flex-col overflow-hidden px-6">
                {/* 헤더 섹션 */}
                <div className="mt-[51px]">
                    <h1 className="text-head-01 text-neutral-1">자녀의 목표를 확인하세요</h1>
                    <p className="mt-3 mb-[0.6px] text-body-05 text-neutral-3">
                        자녀가 설정한 목표 정보를 확인한 뒤<br />
                        계좌 개설을 완료해 주세요.
                    </p>
                </div>

                {/* 입력 정보 섹션 */}
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
                        isNumeric
                        disabled
                    />
                    <NormalInput2
                        label="한 달에 얼마를 모을까요?"
                        value={`${goalData.monthlyAmount} 원`}
                        onChange={() => { }}
                        isNumeric
                        disabled
                    />
                    <NormalInput2
                        label="언제 저금할까요?"
                        value={`${goalData.savingDay} 일`}
                        onChange={() => { }}
                        isNumeric
                        disabled
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
                <div className="mt-[54.5px] flex">
                    <BigButtonActivated label="목표 적금 생성하기" onClick={handleConfirm} />
                </div>
            </main>
        </div>
    )
}
