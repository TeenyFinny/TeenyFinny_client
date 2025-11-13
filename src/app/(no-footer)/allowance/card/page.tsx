"use client";
import { useState } from "react";
import Step01CardIntro from "./Step01CardIntro";
export default function Page() {
  const [step, setStep] = useState(1);
  return (
    <>
      {step === 1 && <Step01CardIntro onNext={() => setStep(2)} />}
      {/* {step === 2 && (
        <Step02
          onNext={() => alert("아직 다음 단계는 구현되지 않았어요!")}
        />
      )} */}
    </>
  );
}
