'use client'

import { RatioSlider } from "@/components/custom/account/RatioSlider";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { NormalInput } from "@/components/ui/input/NormalInput";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { useState } from "react";

// app/saving/page.tsx
export default function Page() {
    const [ammount, setAmmount] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [investmentRatio, setInvestmentRatio] = useState<number>(50);

    const ammountHandler = (text: string) => {
        setAmmount(text)
    }

    const summitHandler = () => {
        const totalAmount = Number(ammount ?? 0)

        // 슬라이더에서 쓰던 것과 동일한 계산식
        const investmentAmount = Math.round((totalAmount * investmentRatio) / 100)
        const allowanceAmount = totalAmount - investmentAmount

        console.log(
            `이체 금액: ${totalAmount}원, ` +
            `투자 금액: ${investmentAmount}원, ` +
            `용돈 금액: ${allowanceAmount}원, ` +
            `이체 일자: ${date ?? ""}일, ` +
            `입금 비율: ${investmentRatio}% 제출됨`
        )
    }


    return (
        <div className="max-h-screen px-[17px] mt-[6px] flex flex-col items-center">
            <div className="w-full">
                <div className="text-head-03 text-neutral-2 ">
                    김티니의
                </div>
                <div className="text-head-01 mb-[39px]">
                    자동이체 설정
                </div>
            </div>

            <div className="w-[320px]">
                <NormalInput
                    label="이체 금액"
                    value={ammount ?? ""}
                    onChange={ammountHandler}
                    placeholder="0"
                    unit="원"
                    isRight={true}
                />
            </div>

            <div className="h-[57px]" />
            <RatioSlider totalAmount={Number(ammount)} investmentRatio={investmentRatio} onChange={setInvestmentRatio} />

            <div className="h-[57px] w-[88px]" />
            <div className="w-[320px]">
                <div className="text-neutral-2 text-body-03 mb-[5px]">
                    이체 일시
                </div>
                <NormalInput2 label="매달" value={date ? date : ""} onChange={setDate} placeholder="1" unit="일" isNumeric={true} />
            </div>

            <div className="h-[57px]" />
            <BigButtonActivated onClick={summitHandler} label="저장하기" />
        </div>
    )
}