"use client";
import { useState } from "react";
import Step01Intro from "./Step01Intro";
import Step02Checklist from "./Step02Checklist";
export default function Page() {
  const [step, setStep] = useState(1);
  return (
    <>
      {step === 1 && <Step01Intro onNext={() => setStep(2)} />}
      {step === 2 && (
        <Step02Checklist
          onNext={() => alert("아직 다음 단계는 구현되지 않았어요!")}
        />
      )}
    </>
  );
}
