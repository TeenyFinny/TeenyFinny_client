"use client";

import { useRouter } from "next/navigation";
import { useLandingStep } from "./useLandingStep";
import LandingStep1 from "./LandingStep1";
import LandingStep2 from "./LandingStep2";
import LandingStep3 from "./LandingStep3";
import LandingStep4 from "./LandingStep4";
import LandingProgressBar from "./LandingProgressBar";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { GrayBigButtonActivated } from "@/components/custom/landing/GrayBigButtonActivated";

/**
 * LandingPage 컴포넌트
 *
 * 온보딩/랜딩 단계별 화면을 순차적으로 보여주는 페이지입니다.
 * 각 단계는 useLandingStep 훅을 통해 관리되며,
 * 단계가 모두 완료되면 홈 화면으로 이동합니다.
 *
 * 구성 요소:
 * - 단계별 콘텐츠 (LandingStep1~4)
 * - 진행 상황 표시 (LandingProgressBar)
 * - 하단 버튼 영역 (다음 / 시작하기)
 */
export default function LandingPage() {
    const router = useRouter();
    const { step, nextStep, prevStep } = useLandingStep();
    const totalSteps = 4;

    /**
     * 현재 step 상태에 따라 렌더링할 단계 컴포넌트를 반환합니다.
     * @returns {JSX.Element | null} 현재 단계에 해당하는 컴포넌트
     */
    const renderStep = () => {
        switch (step) {
            case 1:
                return <LandingStep1 />;
            case 2:
                return <LandingStep2 />;
            case 3:
                return <LandingStep3 />;
            case 4:
                return <LandingStep4 />;
            default:
                return null;
        }
    };

    /**
     * "다음" 버튼 클릭 시 호출되는 핸들러
     *
     * - 마지막 단계 전까지는 다음 단계로 이동합니다.
     * - 마지막 단계에서는 홈(/home) 페이지로 이동합니다.
     */
    const handleNext = () => {
        if (step < totalSteps) {
            nextStep();
        } else {
            router.push("/login");
        }
    };

    return (
        <main className="relative w-full h-screen flex max-h-[746px] flex-col justify-between bg-primary-4">
            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 w-full flex justify-center mt-[26px]">
                {renderStep()}
            </div>

            {/* 하단 영역 */}
            <div className="w-full flex flex-col items-center mb-[56px]">
                {/* 프로그레스바 (버튼과 16px 간격 유지) */}
                <div className="mb-[16px]">
                    <LandingProgressBar current={step} total={totalSteps} />
                </div>

                {/* 다음 / 시작하기 버튼 */}
                <div className="w-[327px]">
                    {step === totalSteps ? (
                        <BigButtonActivated
                            label="시작하기"
                            onClick={handleNext}
                        />
                    ) : (
                        <GrayBigButtonActivated
                            label="다음"
                            onClick={handleNext}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
