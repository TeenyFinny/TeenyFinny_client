"use client";

import React, { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LoadingScreenSkeletonQuiz
 *
 * 퀴즈 페이지 로딩용 스켈레톤 UI 컴포넌트.
 * 중앙에 300x300 박스를 두고, 내부에는 상단 텍스트, 중앙 이미지, 하단 텍스트를 표시합니다.
 *
 * @example
 * return <LoadingScreenSkeletonQuiz />;
 *
 * @returns {JSX.Element}
 */
export default function LoadingScreenSkeletonQuiz(): JSX.Element {
  return (
    <div className="w-full h-full flex items-center justify-center animate-in fade-in-50">
      <div className="flex flex-col items-center justify-between w-[300px] h-[400px] gap-4 p-8 border rounded-xl">
        {/* 상단 텍스트 */}
        <Skeleton className="h-6 w-[80%]" />

        {/* 중앙 이미지 */}
        <Skeleton className="h-[200px] w-[200px] rounded-lg" />

        {/* 하단 텍스트 */}
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
}
