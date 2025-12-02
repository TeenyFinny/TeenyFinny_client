"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import Step01Checklist from "./Step01Checklist"
import Step02Agreement from "./Step02Agreement"
import Step03Auth from "./Step03Auth"
import Step04Terms from "./Step04Terms"
import Step05Review from "./Step05Review"
import Step06Complete from "./Step06Complete"
import LoadingScreenCircle from "@/components/ui/LoadingScreenCircle"

export default function Page() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const next = () => setStep((prev) => prev + 1)

  return (
    <>
      {step === 1 && <Step01Checklist onNext={next} />}
      {step === 2 && <Step02Agreement onNext={next} />}
      {step === 3 && <Step03Auth onNext={next} />}
      {step === 4 && <Step04Terms onNext={next} />}
      {step === 5 && <LoadingScreenCircle onComplete={() => setStep(6)} />}
      {step === 6 && <Step05Review onNext={next} />}
      {step === 7 && <Step06Complete onNext={() => router.push("/home")} />}
    </>
  )
}
