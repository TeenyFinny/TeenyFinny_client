// src/app/(auth)/signup/useRgisterStep.tsx
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

/**
 * @typedef {Object} RegisterStepContextValue
 * @property {number} step - 현재 회원가입 단계 (1부터 시작)
 * @property {number} totalSteps - 전체 회원가입 단계 수
 * @property {() => void} next - 다음 단계로 이동하는 함수
 * @property {() => void} prev - 이전 단계로 이동하는 함수
 * @property {(target: number) => void} goTo - 특정 단계로 직접 이동하는 함수
 */
interface RegisterStepContextValue {
  step: number;
  totalSteps: number;
  next: () => void;
  prev: () => void;
  goTo: (target: number) => void;
}

/**
 * 회원가입 단계 관리를 위한 Context 객체입니다.
 *
 * `RegisterStepProvider` 내부에서만 사용해야 하며,
 * 단계 값(`step`)과 제어 함수(`next`, `prev`, `goTo`)를 제공합니다.
 */
export const RegisterStepContext =
  createContext<RegisterStepContextValue | null>(null);

const TOTAL_STEPS = 6;

type RegisterStepProviderProps = Readonly<PropsWithChildren>;

/**
 * RegisterStepProvider
 *
 * 회원가입 플로우의 단계 전환을 관리하는 Context Provider입니다.
 *
 * ### 제공 기능
 * - 현재 단계(`step`) 상태 관리
 * - `next()` / `prev()` / `goTo()`로 단계 제어
 * - 총 단계 수(`totalSteps`) 상수 제공
 *
 * @component
 * @param {RegisterStepProviderProps} props - 자식 요소를 감싸는 Provider 속성
 * @returns {JSX.Element} 단계 관리 Context Provider
 */
export function RegisterStepProvider({ children }: RegisterStepProviderProps) {
  const [step, setStep] = useState(1);

  /** 다음 단계로 이동 (최대 TOTAL_STEPS까지) */
  const next = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS));

  /** 이전 단계로 이동 (최소 1단계까지) */
  const prev = () => setStep((current) => Math.max(current - 1, 1));

  /** 특정 단계로 이동 (1 ~ TOTAL_STEPS 범위 제한) */
  const goTo = (target: number) =>
    setStep(() => Math.min(Math.max(target, 1), TOTAL_STEPS));

  /** 메모이제이션된 Context 값 */
  const value = useMemo(
    () => ({
      step,
      totalSteps: TOTAL_STEPS,
      next,
      prev,
      goTo,
    }),
    [step]
  );

  return (
    <RegisterStepContext.Provider value={value}>
      {children}
    </RegisterStepContext.Provider>
  );
}

/**
 * useRegisterStep
 *
 * `RegisterStepProvider` 내부에서 현재 단계 상태와 제어 함수를 가져오는 훅입니다.
 *
 * @throws {Error} Provider 외부에서 호출 시 에러 발생
 * @returns {RegisterStepContextValue} 단계 상태 및 제어 함수
 */
export const useRegisterStep = () => {
  const context = useContext(RegisterStepContext);
  if (!context) {
    throw new Error(
      "useRegisterStep 훅은 RegisterStepProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};
