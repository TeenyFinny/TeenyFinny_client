"use client";
import { useState } from "react";
import Step01Intro from "./Step01Intro";
import Step02Checklist from "./Step02Checklist";
import Step03AuthAgreement from "./Step03AuthAgreement";
import Step04Auth from "./Step04Auth";
import Step06ProductAgreement from "./Step06ProductAgreement";
import Step07ChildInfoInput from "./Step07ChildInfo";
import Steop08Complete from "./Step08Complete";
export default function Page() {
  const [step, setStep] = useState(1);
  return (
    <>
      {step === 1 && <Step01Intro onNext={() => setStep(2)} />}
      {step === 2 && <Step02Checklist onNext={() => setStep(3)} />}
      {step == 3 &&  <Step03AuthAgreement onNext={() => setStep(4)} />}
      {step == 4 &&  <Step04Auth onNext={() => setStep(6)} />}
      {step == 6 &&  <Step06ProductAgreement onNext={() => setStep(7)} />}
      {step == 7 &&  <Step07ChildInfoInput onNext={() => setStep(8)} />}
      {step === 8 &&  <Steop08Complete/> }
    </>
  );
}
