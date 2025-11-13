"use client";
import { useState } from "react";
import Step01CardIntro from "./Step01CardIntro";
import Step02CardAuthAgreement from "./Step02CardAuthAgreement";
export default function Page() {
  const [step, setStep] = useState(1);
  return (
    <>
      {step === 1 && <Step01CardIntro onNext={() => setStep(2)} />}
      {step === 2 && (
        <Step02CardAuthAgreement
          onNext={() => alert("아직 다음 단계는 구현되지 않았어요!")}
        />
      )}
    </>
  );
}
