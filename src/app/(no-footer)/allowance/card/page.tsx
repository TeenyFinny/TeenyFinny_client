"use client";
import { useState } from "react";
import Step01CardIntro from "./Step01CardIntro";
import Step02CardAuthAgreement from "./Step02CardAuthAgreement";
import Step03CardAuth from "./Step03CardAuth";
import Step04CardOptions from "./Step04Options";
export default function Page() {
  const [step, setStep] = useState(1);
  return (
    <>
      {step === 1 && <Step01CardIntro onNext={() => setStep(2)} />}
      {step === 2 && <Step02CardAuthAgreement onNext={() => setStep(3)} />}
      {step === 4 && <Step03CardAuth onNext={() => setStep(4)} />}
      {step === 4 && (
        <Step04CardOptions
          onNext={() => alert("아직 다음 단계는 구현되지 않았어요!")}
        />
      )}
    </>
  );
}
