"use client"

import React from "react"

interface LandingProgressBarProps {
  /** 현재 진행 중인 단계 (1부터 시작) */
  current: number
  /** 전체 단계 수 */
  total: number
}

/**
 * LandingProgressBar
 * 
 * - 전체 페이지 개수(`total`)와 현재 단계(`current`)를 기반으로 진행 상태를 표시합니다.
 * - 현재 단계는 primary 컬러, 나머지는 회색으로 표시됩니다.
 */
export default function LandingProgressBar({ current, total }: LandingProgressBarProps) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-[4px] w-[66px] rounded-full transition-colors duration-300 ${
            current === step
              ? "bg-primary-1"
              : "bg-neutral-3"
          }`}
        />
      ))}
    </div>
  )
}
