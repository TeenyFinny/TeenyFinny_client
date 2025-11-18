"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated"
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog"
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"

export default function DeleteReconfirmationPage() {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // ✅ 버튼 클릭 핸들러
    const handleConfirmClick = () => setIsDialogOpen(true)
    const handleConfirm = () => router.push("/goal")
    const handleCancel = () => router.push("/goal")

    return (
        <div className="flex h-[600px] flex-col overflow-hidden bg-primary-4">
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
                    투자계좌가 없어요 <br />
                    만들러 갈까요?
                </h1>

                {/* 버튼 영역 */}
                <div className="mt-[57px] flex gap-2.5 px-6">
                    <BigButtonActivated label="투자 계좌 만들러 가기" onClick={handleConfirmClick} />
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
