"use client"
import { useState } from "react"
import Step1Intro from "./Step01Intro"
export default function Page() {
  const [step, setStep] = useState(1)
  return (
    <>
      {/* {step === 1 && <Step1Intro onNext={() => setStep(2)} />} */}
      {step === 1 && (
        <Step1Intro onNext={() => alert("아직 다음 단계는 구현되지 않았어요!")} />
      )}
    </>
  )
}
