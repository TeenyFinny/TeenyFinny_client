"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog"

export default function GoalAchievePage() {
    const router = useRouter()

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleConfirm = async () => {
        try {
            // 1. 내 진행 중인 목표 ID 조회
            const goalRes = await api.get(requests.fetchMyOngoingGoal)
            const goalId = goalRes.data

            // 2. 목표 완료 요청 API 호출
            await api.post(requests.requestComplete(goalId))

            // 3. 성공 시 모달 오픈
            setIsModalOpen(true)
        } catch (error) {
            console.error("목표 완료 요청 실패:", error)
            // 에러 처리 (예: 알림 표시)
            alert("목표 완료 요청에 실패했습니다.")
        }
    }

    const handleModalConfirm = () => {
        router.push("/home")
    }

    return (
        <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
            <main className="flex flex-col items-center px-6">
                {/* Title */}
                <h1 className="mt-[51px] text-head-01 text-neutral-1">
                    <span className="text-primary-3">♥</span> 목표 달성 완료 {" "}
                    <span className="text-primary-3">♥</span>
                </h1>
                <p className="mt-2.5 text-body-05 text-neutral-3">
                    꾸준히 모으다니 대단해요!
                </p>

                {/* Character Illustration */}
                <div className="mt-10 flex justify-center">
                    <img
                        src="/images/saving/illust_saving_3.png"
                        alt="돼지 저금통을 들고 있는 캐릭터"
                        className="h-[233px] w-[350px] object-contain"
                    />
                </div>

                {/* Warning Text - 단일 텍스트 블록 */}
                <p className="mt-9 text-head-01 text-neutral-1 text-center whitespace-pre-line">
                    부모님과 함께{"\n"}
                    <span className="text-primary-1">가까운 은행</span>
                    에 방문해{"\n"}
                    모은 돈을 받아 가세요!
                </p>

                {/* Buttons */}
                <div className="absolute bottom-14 flex">
                    {/* "확인" → API 호출 후 모달 */}
                    <BigButtonActivated label="확인" onClick={handleConfirm} />
                </div>
            </main>

            <ConfirmationDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="부모님께 목표 달성 알림을 보냈어요!"
                description="가까운 영업점에 방문하여 해지하세요"
                confirmText="확인"
                onConfirm={handleModalConfirm}
            />
        </div>
    )
}
