"use client";

import { useState } from "react";
import LoadingScreenCircle from "@/components/ui/LoadingScreenCircle"; // 경로 맞춰서 변경
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";
import LoadingScreenSkeleton from "@/components/ui/LoadingScreenSkeleton";
import LoadingScreenSkeletonDashboard from "@/components/ui/LoadingScreenSkeletonDashboard";
import LoadingScreenSkeletonDetail from "@/components/ui/LoadingScreenSkeletonDetail";
import LoadingScreenSkeletonQuiz from "@/components/ui/LoadingScreenSkeletonQuiz";

export default function Page() {
    
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);

  return (
    <main className="h-[600px] flex flex-col justify-center items-center gap-6 bg-primary-4 p-6">
      {!showLoading && (
        <>
          <h1 className="text-2xl font-bold text-neutral-900">
            LoadingScreen 테스트 페이지
          </h1>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setShowLoading(true)}
          >
            로딩 시작
          </button>
        </>
      )}

      {showLoading && (
        <LoadingScreenSkeletonQuiz
        />
      )}
    </main>
  );
}
