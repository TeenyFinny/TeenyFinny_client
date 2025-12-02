"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * SplashScreen
 *
 * 스플래시 화면 컴포넌트
 * - 중앙에 텍스트 + 이미지
 * - 1.5초 후 자동으로 /login 페이지로 이동
 */
export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // 최초 방문 시에만 스플래시 표시
    const hasVisited = sessionStorage.getItem("has-visited");

    if (!hasVisited) {
      // 스플래시 표시 후 1.5초 뒤 login으로 이동
      const timer = setTimeout(() => {
        sessionStorage.setItem("has-visited", "true");
        router.push("/login");
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // 이미 방문한 경우 바로 login으로 이동
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-primary-4">
      {/* 텍스트 */}
      <h1 className="text-head-01 font-bold text-primary-1">Teeny Finny</h1>

      {/* 이미지 */}
      <div className="mt-[17px]">
        <Image
          src="/logos/202X135.png"
          alt="Splash Logo"
          width={202}
          height={135}
          priority
        />
      </div>
    </div>
  );
}
