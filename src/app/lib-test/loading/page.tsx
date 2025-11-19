"use client";

import { useState } from "react";
import LoadingScreenCircle from "@/components/ui/LoadingScreenCircle"; // 경로 맞춰서 변경
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";

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
        <LoadingScreen 
          duration={2000} // 3초 동안 차오름
          imageSrc = "/images/common/illust_common_bigcoin.png"
          progressBgColor="bg-monochrome-lightgray"
          progressIndicatorColor="bg-primary-1"
          onComplete={() => {
            setShowLoading(false);
          }}
        />
      )}
    </main>
  );
}
