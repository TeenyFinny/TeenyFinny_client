// app/(auth)/signup/layout.tsx
"use client";

import HeaderbarWrapper from "@/components/layout/headerbar/HeaderbarWrapper";
import React from "react";
import { RegisterStepProvider, useRegisterStep } from "./useRgisterStep";
import { useRouter } from "next/navigation";

/**
 * SignupLayout
 *
 * 회원가입 페이지 전용 레이아웃입니다.
 *
 * ### 주요 역할
 * - RegisterStepProvider로 전체 단계(Context) 상태 관리
 * - HeaderbarWrapper + ProgressBar 렌더링
 * - 각 단계별 자식 페이지(`children`)을 표시
 *
 * @component
 * @param {Readonly<{ children: React.ReactNode }>} props - 레이아웃에 포함될 자식 컴포넌트
 * @returns {JSX.Element} 회원가입 레이아웃 UI
 */
export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RegisterStepProvider>
      <SignupLayoutShell>{children}</SignupLayoutShell>
    </RegisterStepProvider>
  );
}

/**
 * SignupLayoutShell
 *
 * 회원가입 레이아웃 내부 UI를 구성하는 셸(Shell) 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 현재 단계(`step`)에 따라 진행률(progress bar) 표시
 * - 뒤로가기(`onBack`) 시 단계 감소 또는 이전 페이지로 이동
 * - 실제 페이지 콘텐츠(`children`) 렌더링
 *
 * ### 진행률 계산 로직
 * `PROGRESS_STEPS = [10, 20, 40, 60, 80, 100]`
 * → step(1~6)에 따라 width 비율을 동적으로 결정합니다.
 *
 * @component
 * @param {Readonly<{ children: React.ReactNode }>} props - 단계별 자식 페이지 요소
 * @returns {JSX.Element} 회원가입 단계 진행 UI 레이아웃
 */
function SignupLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { step, prev } = useRegisterStep();

  /** 단계별 진행률 퍼센트 값 */
  const PROGRESS_STEPS = [10, 20, 40, 60, 80, 100] as const;
  const progressWidth =
    PROGRESS_STEPS[Math.min(step - 1, PROGRESS_STEPS.length - 1)];

  return (
    <div className="mx-auto flex h-full w-full max-w-[375px] flex-col bg-primary-4">
      {/* 상단 헤더 (뒤로가기 버튼 포함) */}
      <HeaderbarWrapper
        onBack={() => {
          if (step > 1) {
            prev();
            return;
          }

          // 브라우저 히스토리가 있을 경우 이전 페이지로 이동
          if (
            typeof globalThis !== "undefined" &&
            globalThis.window &&
            globalThis.window.history.length > 1
          ) {
            router.back();
          } else {
            // 루트("/")로 이동
            router.push("/");
          }
        }}
      />

      {/* 진행 상태바 */}
      <div className="flex w-full flex-col gap-2 px-6">
        <div className="relative h-3 w-full overflow-hidden rounded-full">
          <div className="absolute inset-0 rounded-full bg-[#d8e2f2]" />
          <div
            className="relative h-full rounded-full bg-primary-1 transition-[width] duration-300 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 h-[700px]">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
