'use client'
import { AccountCard } from "@/components/custom/account/AccountCard"
import { ChildrenBadge } from "@/components/ui/badge/ChildrenBadge";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { HttpError } from "@/types/axios/httpError.t";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

type Child = {
    name: string,
    childId: number,
    gender: number
};

type Accounts = {
    total: number,
    allowance: number,
    invest: number,
    saving: number
}

// app/saving/page.tsx
export default function Page() {
    const router = useRouter();
    const [data, setData] = useState<Child[] | null>(null);
    const [accountData, setAccountData] = useState<Accounts | null>(null);
    const [currentChild, setCurrentChild] = useState<number>(0);

    const [total, setTotal] = useState<number>(-1);
    const [allowance, setAllowance] = useState<number>(-1);
    const [invest, setInvest] = useState<number>(-1);
    const [saving, setSaving] = useState<number>(-1);

    const { userType, userId } = useUserStore()

    /* 상세 내용 보기 클릭 이벤트 */
    const handleViewDetails = (accountName: string) => {
        console.log("(id=" + currentChild + ")인 아이의 " + `${accountName} 상세 내역 보기`)
    };

    /* 카드 뱃지 클릭 이벤트 */
    const handleViewCard = () => {
        console.log("(id=" + currentChild + ")인 아이의 카드 바텀시트 리다이렉트")
    };

    const childHandler = (id: number) => {
        setCurrentChild(id);
    }

    const autoTransHandler = () => {
        router.push(`/account/auto-transfer/${currentChild}`)
    }

    const reportHandler = () => {
        console.log("(id=" + currentChild + ")인 아이의 리포트 페이지와 리다이렉트")
    }

    /* getChild api 호출부분 */
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                // 인터셉터가 res.data를 반환하므로 res가 응답 바디
                // <ApiResponse<Notice>>는 없어도 작동함 (타입 지정)
                const res = await api.get<ApiResponse<Child[]>>(requests.fetchChild, {
                    signal: controller.signal,
                    params: { id: userId }
                });

                if (controller.signal.aborted) return;

                setData(res.data as Child[]);
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
    }, []);

    /* 계좌 정보 api 호출 부분 */
    useEffect(() => {
        (async () => {
            try {
                // 인터셉터가 res.data를 반환하므로 res가 응답 바디
                // <ApiResponse<Notice>>는 없어도 작동함 (타입 지정)
                const res = await api.get<ApiResponse<Accounts>>(requests.fetchTotalAccount, {
                    params: { id: currentChild }
                });

                setAccountData(res.data as Accounts);
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
        };
    }, [currentChild]);

    /* 자녀 불러오기 api 호출이 성공적이라면 첫번째 아이로 currentchild 세팅 */
    useEffect(() => {
        if (data && data.length > 0 && currentChild === 0) {
            setCurrentChild(data[0].childId);
        }
    }, [data]);

    /* 계좌정보 api 호출이 성공적이라면 첫번째 아이로 currentchild 세팅 */
    useEffect(() => {
        if (accountData) {
            setTotal(accountData.total);
            setAllowance(accountData.allowance);
            setInvest(accountData.invest);
            setSaving(accountData.saving);
        }
    }, [accountData]);

    return (
        <div className="max-h-screen px-[17px]">
            <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-start">
                    <div className="flex justify-evenly gap-[13px]">
                        {data && data.length > 0 ? (
                            data.map((child) => (
                                <ChildrenBadge
                                    key={child.childId}
                                    name={child.name}
                                    gender={child.gender}
                                    childId={child.childId}
                                    currentChild={currentChild}
                                    setCurrentChild={() => childHandler(child.childId)}
                                />
                            ))
                        ) : (
                            <span className="text-body-04 text-[#989898]">아이의 데이터를 불러오고 있어요!</span>
                        )}
                    </div>

                </div>
                <div className="h-[21px] flex justify-between items-center">
                    <p className="text-head-03 text-neutral-3 mb-[10px] mt-[22px]">
                        총 잔액
                    </p>
                    {userType == "parent" ? <button className="w-[59px] h-[31px] text-body-03 font-light! text-neutral-7 bg-primary-2 rounded-2xl"
                        onClick={() => autoTransHandler()}>
                        자동이체
                    </button> : null}
                </div>
                <div className="text-head-00 text-neutral-1 mb-4">{total} 원</div>

                {/* 카드가 있는 용돈 계좌 */}
                <AccountCard
                    accountName="용돈 계좌"
                    balance={allowance}
                    showCard={true}
                    onViewDetails={() => handleViewDetails("용돈 계좌")}
                    onCardClick={() => handleViewCard()}
                />

                {/* 투자 계좌 */}
                <AccountCard
                    accountName="투자 계좌"
                    balance={invest}
                    onViewDetails={() => handleViewDetails("투자 계좌")}
                    onCardClick={() => null}
                />

                {/* 목표 적금 */}
                <AccountCard
                    accountName="목표 적금"
                    balance={saving}
                    onViewDetails={() => handleViewDetails("목표 적금")}
                    onCardClick={() => null}
                />

                <button
                    className="flex justify-start w-[335px] h-[48px] border-1 border-monochrome-gray
                    bg-neutral-7 rounded-4xl text-body-04 items-center mt-0"
                    onClick={() => reportHandler()}
                >
                    <img
                        src="/images/account/illust_account_report.png"
                        alt="리포트 아이콘"
                        className="ml-[12px] mr-[7px] w-[40px] h-[40px]"
                    />
                    소비 리포트 보러가기
                </button>
            </div>
        </div>
    )

}
