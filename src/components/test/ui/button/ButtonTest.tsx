"use client"

import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { MiddleButtonActivated } from "@/components/ui/button/MiddleButtonActivated" 
import { MiddleButtonDisabled } from "@/components/ui/button/MiddleButtonDisabled"
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated" 
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled"
import { TinyButton } from "@/components/ui/button/TinyButton"

export default function ButtonTest() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f6f7f8]">
            <div className="flex flex-col justify-center w-full max-w-[672px]">
                <div className="mb-10 text-head-01">
                    활성화된 버튼 테스트
                </div>
                <div className="flex flex-col gap-5 justify-center item">
                    <BigButtonActivated label="Big Button Label" onClick={() => alert("버튼 클릭됨!")} />
                    <MiddleButtonActivated label="Middle Button Label" onClick={() => alert("버튼 클릭됨!")} />
                    <SmallButtonActivated label="Small Button Label" onClick={() => alert("버튼 클릭됨!")} />
                </div>

                <div className="mb-10 mt-10 text-head-01">
                    비활성화된 버튼 테스트
                </div>
                <div className="flex flex-col gap-5 justify-center item">
                    <BigButtonDisabled label="Big Button Label" onClick={() => alert("버튼 클릭됨!")} />
                    <MiddleButtonDisabled label="Middle Button Label" onClick={() => alert("버튼 클릭됨!")} />
                    <SmallButtonDisabled label="Small Button Label" onClick={() => alert("버튼 클릭됨!")} />
                </div>

                <div className="mb-10 mt-10 text-head-01">
                    극소 버튼 테스트
                </div>
                <div className="flex flex-col gap-5 justify-center item">
                    <TinyButton label="사기" onClick={() => alert("버튼 클릭됨!")} />
                </div>
            </div>
        </main>
    )
}
