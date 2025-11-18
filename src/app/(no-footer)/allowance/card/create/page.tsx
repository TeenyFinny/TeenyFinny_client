"use client";
import { useState } from "react";
import Step01CardIntro from "./Step01CardIntro";
import Step02CardAuthAgreement from "./Step02CardAuthAgreement";
import Step03CardAuth from "./Step03CardAuth";
import Step04CardOptions from "./Step04CardOptions";
import Step05CardComplete from "./Step05CardComplete";
import { useSearchParams } from "next/navigation";
export default function Page() {
  const params = useSearchParams();
  const childId = Number(params.get("childId"));
  const [step, setStep] = useState(1);
  return (
    <>
      {step === 1 && <Step01CardIntro onNext={() => setStep(2)} />}
      {step === 2 && <Step02CardAuthAgreement onNext={() => setStep(3)} />}
      {step === 3 && <Step03CardAuth onNext={() => setStep(4)} />}
      {step === 4 && <Step04CardOptions onNext={() => setStep(5)} childId={childId}/>}
      {step === 5 && <Step05CardComplete />}
    </>
  );
}
