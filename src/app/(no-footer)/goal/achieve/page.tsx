"use client"

import { useRouter } from "next/navigation"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"

export default function GoalAchievePage() {
    const router = useRouter()

    const handleConfirm = () => {
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
                    {/* "확인" → /home 페이지 */}
                    <BigButtonActivated label="확인" onClick={handleConfirm} />
                </div>
            </main>
        </div>
    )
}
