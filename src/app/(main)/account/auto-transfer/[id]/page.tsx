'use client'

import { RatioSlider } from "@/components/custom/account/RatioSlider";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { DisabledInputField } from "@/components/ui/input/DisabledInputField";
import { NormalInput } from "@/components/ui/input/NormalInput";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { HttpError } from "@/types/axios/httpError.t";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
    id: string
}

type AutoTransfer = {
    isInit: boolean,
    userId: string,
    transferId: string,
    transferAmmount: string,
    transferDate: string,
    ratio: number
}

// app/saving/page.tsx
export default function Page() {
    const [ammount, setAmmount] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [investmentRatio, setInvestmentRatio] = useState<number>(50);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isInit, setIsInit] = useState<boolean>(true);
    const [deleteButtonFlag, setDeleteButtonFlag] = useState<boolean>(false);
    const [autoTransferId, setAutoTransferId] = useState<number>(-1);

    const { id } = useParams<Params>();
    const router = useRouter();

    const ammountHandler = (text: string) => {
        setAmmount(text)
    }

    const updateSubmitHandler = async () => {
        const totalAmmount = Number(ammount ?? 0)

        const investmentAmmount = Math.round((totalAmmount * investmentRatio) / 100)
        const allowanceAmmount = totalAmmount - investmentAmmount

        try{
            if (isInit) {
                await api.post(requests.getAutoTransfer, {
                    params: { 
                        userId: id ,
                        transferAmmount : ammount,
                        transferDate : date,
                        ratio : investmentRatio
                    }
                })
            } else {
                await api.put(requests.getAutoTransfer, {
                    params: { 
                        autoTransferId: autoTransferId ,
                        transferAmmount : ammount,
                        transferDate : date,
                        ratio : investmentRatio
                    }
                })
            }

            console.log(
                `이체 금액: ${totalAmmount}원, ` +
                `투자 금액: ${investmentAmmount}원, ` +
                `용돈 금액: ${allowanceAmmount}원, ` +
                `이체 일자: ${date ?? ""}일, ` +
                `투자 계좌 입금 비율: ${investmentRatio}% 제출됨`
            )
            router.push(`/account`)
        } catch (e) {
            if (e instanceof HttpError) {
                // 권한이 없다면 온보딩 화면으로 라우팅
                if (e.statusCode === 403) {
                    router.push("/");
                } else {
                    // 필요 시 다른 에러 처리
                    console.error(e);
                }
            } else {
                console.error("An unexpected error occurred", e);
            }
        }
    }

    const deleteSubmitHandler = async () => {
        const totalAmmount = Number(ammount ?? 0)

        const investmentAmmount = Math.round((totalAmmount * investmentRatio) / 100)
        const allowanceAmmount = totalAmmount - investmentAmmount

        try {
            await api.delete(requests.getAutoTransfer, {
                params: { autoTransferId: autoTransferId }
            })

            console.log(
                `${autoTransferId} 삭제 요청 완료`
            )

            router.push(`/account`)
        } catch (e) {
            if (e instanceof HttpError) {
                // 권한이 없다면 온보딩 화면으로 라우팅
                if (e.statusCode === 403) {
                    router.push("/");
                } else {
                    // 필요 시 다른 에러 처리
                    console.error(e);
                }
            } else {
                console.error("An unexpected error occurred", e);
            }
        }
    }

    const editButtonHandler = () => {
        if (isEdit)
            setIsEdit(false);
        else
            setIsEdit(true);
    }

    /* getChild api 호출부분 */
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                // 인터셉터가 res.data를 반환하므로 res가 응답 바디
                // <ApiResponse<Notice>>는 없어도 작동함 (타입 지정)
                const res = await api.get<ApiResponse<AutoTransfer>>(requests.getAutoTransfer, {
                    signal: controller.signal,
                    params: { userId: id }
                });

                if (controller.signal.aborted) return;

                const data = res.data;

                const init = data.isInit === "true";

                setIsInit(init);

                if (!init) {
                    setDate(data.transferDate ?? null);
                    setAmmount(data.transferAmmount ?? null);
                    setInvestmentRatio(Number(data.ratio ?? -1));
                    setAutoTransferId(Number(data.autoTransferId ?? -1))
                }
            } catch (e) {
                if (e instanceof HttpError) {
                    // 권한이 없다면 온보딩 화면으로 라우팅
                    if (e.statusCode === 403) {
                        router.push("/");
                    } else {
                        // 필요 시 다른 에러 처리
                        console.error(e);
                    }
                } else {
                    console.error("An unexpected error occurred", e);
                }
            }
        })();

        return () => {
            controller.abort();
        };
    }, [id]);

    useEffect(() => {
        if (isInit)
            setDeleteButtonFlag(false);
        else if (isEdit)
            setDeleteButtonFlag(false);
        else
            setDeleteButtonFlag(true);
    }, [isEdit, isInit])

    return (
        <div className="max-h-screen px-[17px] mt-[6px] flex flex-col items-center">
            <div className="w-full">
                <div className="text-head-03 text-neutral-2 ">
                    김티니의
                </div>
                <div className="text-head-01 mb-[39px] flex flex-row">
                    자동이체 설정
                    {isInit ?
                        null :
                        <button onClick={editButtonHandler}>
                            <Image src="/icons/edit.png" alt="수정하기" width={27} height={27} className="ml-[6px]" />
                        </button>
                    }
                </div>
            </div>

            <div className="w-[320px]">
                {deleteButtonFlag ?
                    <DisabledInputField
                        label="이체 금액"
                        content={ammount ? ammount : "0"}
                        isRight={true}
                        unit="원"
                    />
                    :
                    <NormalInput
                        label="이체 금액"
                        value={ammount ?? ""}
                        onChange={ammountHandler}
                        placeholder="0"
                        unit="원"
                        isRight={true}
                    />
                }
            </div>

            <div className="h-[57px]" />
            <RatioSlider totalAmmount={Number(ammount)} investmentRatio={investmentRatio} onChange={setInvestmentRatio} disabled={deleteButtonFlag} />

            <div className="h-[57px] w-[88px]" />
            <div className="w-[320px]">

                {deleteButtonFlag ?
                    <DisabledInputField
                        label="이체 일시"
                        content={date ? date : ""}
                        isRight={true}
                        unit="일"
                    /> :
                    <div className="w-[320px]">
                        <div className="text-body-03 text-neutral-2 mt-[6px] mb-[3.5px]">
                            이체 일시
                        </div>
                        <NormalInput2 label="매달" value={date ? date : ""} onChange={setDate} placeholder="1" unit="일" isNumeric={true} />
                    </div>
                }

                <div className="h-[57px]" />
                {
                    deleteButtonFlag ?
                        <BigButtonActivated onClick={deleteSubmitHandler} label="삭제하기" />
                        : <BigButtonActivated onClick={updateSubmitHandler} label="저장하기" />
                }
            </div>
        </div>
    )
}