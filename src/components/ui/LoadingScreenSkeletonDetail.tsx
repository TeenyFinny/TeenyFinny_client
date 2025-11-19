"use client";

import React, { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LoadingScreenSkeletonDetail Props
 */
export interface LoadingScreenSkeletonDetailProps {
  /**
   * 하단 프로필 리스트 스켈레톤 개수
   *
   * @default 3
   */
  count?: number;
}

/**
 * LoadingScreenSkeletonDetail
 *
 * 상세 페이지 로딩용 Skeleton UI.
 * 상단 카드 1개(짧은 줄 + 긴 줄)와
 * 하단 프로필 리스트(count 만큼)로 구성됩니다.
 *
 * @example
 * <LoadingScreenSkeletonDetail count={5} />
 *
 * @returns {JSX.Element}
 */
export default function LoadingScreenSkeletonDetail({
  count = 3,
}: LoadingScreenSkeletonDetailProps): JSX.Element {
  return (
    <main className="w-full h-full flex flex-col gap-8 p-6 animate-in fade-in-50">

      {/* 상단 카드 1개 */}
      <div className="flex w-full items-start gap-4 p-2 rounded-xl">
        <Skeleton className="h-[125px] w-[300px] rounded-xl" />
      </div>
      

      {/* 하단 프로필 리스트 */}
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-4 w-[40%]" />
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
