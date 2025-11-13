"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * SplashPage
 *
 * 스플래시 화면
 * - 중앙에 텍스트 + 이미지
 * - 1초 후 자동으로 /landing 페이지로 이동
 */
export default function SplashPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/landing"); // 나중에 실제 랜딩 페이지 경로로 변경
        }, 1500); // 1.5초 대기

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="w-screen h-screen flex flex-col max-h-[746px] items-center bg-primary-4">
            {/* 텍스트 */}
            <h1 className="text-head-01 font-bold text-primary-1 mt-[249px]">
                Teeny Finny
            </h1>

            {/* 이미지 */}
            <div className="mt-[17px]">
                <Image
                    src="/logos/202X135.png" // 실제 이미지 경로
                    alt="Splash Logo"
                    width={200}
                    height={200}
                    priority
                />
            </div>


        </div>
    );
}
