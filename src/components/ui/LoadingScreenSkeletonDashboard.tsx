"use client";

import React, { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LoadingScreenSkeletonDashboard Props
 */
export interface LoadingScreenSkeletonDashboardProps {
  /**
   * 표시할 카드 스켈레톤 개수
   *
   * @default 3
   */
  cardCount?: number;
}

/**
 * LoadingScreenSkeletonDashboard
 *
 * 대시보드 페이지 로딩에 사용되는 Skeleton UI.
 * 제목(2줄)과 카드 형태 리스트를 출력하며,
 * `cardCount` 값을 통해 카드 개수를 조절할 수 있습니다.
 *
 * @example
 * <LoadingScreenSkeletonDashboard cardCount={5} />
 *
 * @returns {JSX.Element}
 */
export default function LoadingScreenSkeletonDashboard({
  cardCount = 3,
}: LoadingScreenSkeletonDashboardProps): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col gap-10 p-6 animate-in fade-in-50">

      {/* 제목 영역 */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[60%]" />
        <Skeleton className="h-5 w-[40%]" />
      </div>
      {/* 카드 리스트 */}
      <div className="space-y-2">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div
            key={idx}
            className="flex w-full items-start gap-2 p-2 rounded-xl"
          >
            <Skeleton className="h-[125px] w-[300px] rounded-xl" />
          </div>
        ))}
      </div>

    </div>
  );
}
