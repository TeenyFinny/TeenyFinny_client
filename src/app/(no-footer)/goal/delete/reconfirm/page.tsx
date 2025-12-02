"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated"
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled"

function DeleteReconfirmationContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const goalId = searchParams.get("goalId")

    // ✅ "부모님께 알리기" 클릭 → 재확인 페이지로 이동
    const handleConfirm = () => {
        router.push(`/goal/delete/final-confirm?goalId=${goalId}`)
    }

    // ✅ "아니요" 클릭 → 적금 상세 페이지로 복귀
    const handleCancel = () => {
        router.push(`/goal/${goalId}`)
    }

    return (
        <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
            <main className="flex flex-col items-center px-6">
                {/* Title */}
                <h1 className="mt-[56px] text-landing-01 text-primary-1 text-center">
                    어떻게 계좌를 <br />
                    삭제할 수 있나요?
                </h1>

                {/* Character Illustration */}
                <div className="mt-[-6px] flex justify-center">
                    <img
                        src="/images/saving/illust_saving_6.png"
                        alt="슬픈 토끼 캐릭터"
                        className="h-[300px] w-[300px] object-contain"
                    />
                </div>

                {/* Warning Text - 단일 텍스트 블록 */}
                <p className="mt-10 text-head-05 text-neutral-2 whitespace-pre-line text-center">
                    부모님과 함께{"\n"}
                    가까운 은행에 방문해{"\n"}
                    계좌를 해지할 수 있어요
                </p>

                {/* Buttons */}
                <div className="absolute bottom-14 flex gap-2.5">
                    {/* "부모님께 알리기" → 재확인 페이지 */}
                    <SmallButtonDisabled label="부모님께 알리기" onClick={handleConfirm} activated={true} />
                    {/* "아니요" → 상세 페이지로 복귀 */}
                    <SmallButtonActivated label="아니요" onClick={handleCancel} />
                </div>
            </main>
        </div>
    )
}

export default function DeleteReconfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeleteReconfirmationContent />
        </Suspense>
    )
}
