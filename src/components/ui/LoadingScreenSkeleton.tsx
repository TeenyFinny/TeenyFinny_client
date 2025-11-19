"use client";

import React, { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LoadingScreenSkeleton Props
 */
export interface LoadingScreenSkeletonProps {
  /**
   * 리스트 스켈레톤 아이템 개수
   *
   * @default 3
   */
  count?: number;
}

/**
 * LoadingScreenSkeleton
 *
 * 리스트 형태 페이지에서 사용할 스켈레톤 로딩 UI.
 * 각 요소는 왼쪽 원형 프로필 + 오른쪽 텍스트 2줄 구조로 구성됩니다.
 *
 * @example
 * <LoadingScreenSkeleton count={5} />
 *
 * @returns {JSX.Element}
 */
export default function LoadingScreenSkeleton({
  count = 3,
}: LoadingScreenSkeletonProps): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col gap-8 p-6 animate-in fade-in-50">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
