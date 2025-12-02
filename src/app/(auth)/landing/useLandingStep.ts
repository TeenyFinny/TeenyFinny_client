"use client";
import { useState } from "react";

export function useLandingStep() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (target: number) => setStep(Math.min(Math.max(target, 1), 4));

  return { step, nextStep, prevStep, goToStep };
}
