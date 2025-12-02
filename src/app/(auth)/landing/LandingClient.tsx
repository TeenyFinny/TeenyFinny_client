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

function renderStep(step: number) {
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
}

export function LandingClient() {
  const router = useRouter();
  const { step, nextStep, goToStep } = useLandingStep();
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      nextStep();
    } else {
      router.push("/home");
    }
  };

  return (
    <main className="relative w-full h-screen flex max-h-[746px] flex-col justify-between bg-primary-4">
      <div className="flex-1 w-full flex justify-center mt-[26px]">
        {renderStep(step)}
      </div>

      <div className="w-full flex flex-col items-center mb-[56px]">
        <div className="mb-[16px]">
          <LandingProgressBar current={step} total={totalSteps} />
        </div>

        <div className="w-[327px]">
          {step === totalSteps ? (
            <BigButtonActivated label="홈으로" onClick={handleNext} />
          ) : (
            <GrayBigButtonActivated label="다음" onClick={handleNext} />
          )}
        </div>

        {step < 4 && (
          <button
            onClick={() => goToStep(4)}
            className="absolute bottom-[25px] text-neutral-2 text-body-06 underline"
          >
            SKIP  
          </button>
        )}

      </div>
    </main>
  );
}

