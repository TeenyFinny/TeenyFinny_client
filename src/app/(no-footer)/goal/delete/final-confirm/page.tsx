"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated"
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog"
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

export default function DeleteReconfirmationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const goalId = searchParams.get("goalId")
    console.log("Final Confirm Page - goalId:", goalId)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // ✅ 버튼 클릭 핸들러
    const handleConfirmClick = async () => {
        if (!goalId) return

        try {
            await api.post(requests.requestCancel(goalId))
            setIsDialogOpen(true)
        } catch (error) {
            console.error("목표 취소 요청 실패:", error)
            alert("목표 취소 요청에 실패했습니다.")
        }
    }
    const handleConfirm = () => router.push(`/goal/${goalId}`)
    const handleCancel = () => router.push(`/goal/${goalId}`)

    return (
        <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
            <main className="flex flex-col items-center px-6">
                {/* 캐릭터 이미지 */}
                <div className="mt-[95px] flex justify-center">
                    <img
                        src="/images/saving/illust_saving_4.png"
                        alt="슬픈 토끼 캐릭터"
                        className="h-[300px] w-[300px] object-contain"
                    />
                </div>

                {/* 타이틀 */}
                <h1 className="mt-[19px] text-landing-01 text-primary-1 text-center">
                    정말 부모님께 <br />
                    알릴까요?
                </h1>

                {/* 버튼 영역 */}
                <div className="absolute bottom-14 flex gap-2.5 px-6">
                    <SmallButtonDisabled label="부모님께 알리기" onClick={handleConfirmClick} activated={true} />
                    <SmallButtonActivated label="아니요" onClick={handleCancel} />
                </div>
            </main>

            {/* ✅ 모달 */}
            <ConfirmationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={`부모님께 목표 삭제 요청을 보냈어요!`}
                description="가까운 영업점에 방문하여 해지하세요"
                confirmText="확인"
                onConfirm={handleConfirm}
            />
        </div>
    )
}
