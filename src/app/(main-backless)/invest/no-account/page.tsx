"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog"
import api from "@/lib/axios/axios" // axios 인스턴스
import requests from "@/lib/axios/requests" // API endpoint
import LoadingScreenSkeletonDetail from "@/components/ui/LoadingScreenSkeletonDetail"

export default function DeleteReconfirmationPage() {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [courseCompleted, setCourseCompleted] = useState(false)
    const [loading, setLoading] = useState(true)


    // 1️⃣ 마운트 시 quiz progress 조회
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(requests.fetchProgress)
                setCourseCompleted(res.data.courseCompleted ?? false)
            } catch (e) {
                console.error("퀴즈 진행도 조회 실패", e)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) return <LoadingScreenSkeletonDetail />

    // 2️⃣ 버튼 클릭 핸들러
    const handleConfirmClick = () => {
        if (courseCompleted) {
            router.push("/quiz/credit") // 이미 완료했다면 바로 이동
        } else {
            setIsDialogOpen(true) // 미완료라면 모달 열기
        }
    }

    const handleConfirm = () => router.push("/quiz")

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
                <div className="mt-[42px] flex gap-2.5 px-6">
                    {courseCompleted ? (
                        // 1️⃣ 이미 완료한 경우 → 모달 없이 바로 이동하는 버튼
                        <BigButtonActivated
                            label="투자 계좌 만들러 가기"
                            onClick={() => router.push("/quiz/credit")}
                        />
                    ) : (
                        // 2️⃣ 미완료 → 모달 필요
                        <DeleteConfirmDialog
                            trigger={
                                <BigButtonActivated
                                    label="투자 계좌 만들러 가기"
                                    onClick={() => { }}  // ❌ 여기서 onClick 쓰면 안 됨
                                />
                            }
                            title="금융 퀴즈를 풀면 계좌를 만들 수 있어요!"
                            description="퀴즈를 풀러 가볼까요?"
                            ltBtnTxt="아니요"
                            rtBtnTxt="네"
                            onClickRtBtn={() => router.push("/quiz")}
                        />
                    )}
                </div>

            </main>
        </div>
    )
}
