"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { useUserStore } from "@/store/userStore";

export default function GoalIntroClient() {
    const router = useRouter();
    const { userType } = useUserStore();

    // URL에서 goalId 가져오기
    const searchParams = useSearchParams();
    const goalId = searchParams.get("goalId");

    console.log("goalId from URL:", goalId);

    const buttonLabel =
        userType === "parent" ? "목표 적금 개설하기" : "목표 생성하기";

    const handleClick = () => {
        if (userType === "parent") {
            if (!goalId) {
                alert("goalId가 없습니다!");
                return;
            }
            // goalId 포함해서 이동
            router.push(`/goal/account/create?goalId=${goalId}`);
        } else {
            router.push("/goal/create");
        }
    };

    return (
        <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
            <main className="flex flex-1 flex-col items-center px-6">
                {/* Title */}
                <div className="mt-12 flex flex-col items-center text-center">
                    <h1 className="text-head-01 text-neutral-1">
                        <span className="text-account-title text-primary-1 block mb-[-2px]">
                            WON
                        </span>
                        목표 적금
                    </h1>
                </div>

                {/* Interest Rates */}
                <div className="mt-8 space-y-[14px]">
                    <div className="text-head-06 text-neutral-1">
                        <span className="text-primary-3">♥</span>
                        <span> 최대 연 5.00%</span>
                        <span className="text-body-08 text-neutral-3"> 적금 만기 해지 시</span>
                    </div>

                    <div className="text-head-06 text-neutral-1">
                        <span className="text-primary-3">♥</span>
                        <span> 기본 연 2.00%</span>
                        <span className="text-body-08 text-neutral-3"> 시작만 해도</span>
                    </div>
                </div>

                {/* Illustration */}
                <div className="mt-17 flex justify-center">
                    <img
                        src="/images/common/illust_common_1.png"
                        alt="티니피니 이미지"
                        className="h-[233px] w-[350px] object-contain"
                    />
                </div>

                {/* Button */}
                <div className="absolute bottom-14 flex px-6">
                    <BigButtonActivated label={buttonLabel} onClick={handleClick} />
                </div>
            </main>
        </div>
    );
}
