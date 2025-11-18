"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";



/**
 * 로딩 화면 컴포넌트
 *
 * 화면 중앙에 이미지를 표시하고, 하단에 프로그레스 바가 나타납니다.
 * 지정된 `duration` 동안 프로그레스가 0에서 100까지 증가하며,
 * 완료 시 `onComplete` 콜백이 호출됩니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {number} [props.duration=2000] - 총 로딩 시간(ms)
 * @param {string} [props.imageSrc="/logos/202X135.png"] - 중앙에 표시할 이미지 경로
 * @param {string} [props.progressBgColor] - 프로그레스 바 배경색 (기본값 있음)
 * @param {string} [props.progressIndicatorColor] - 프로그레스 바 진행 색상 (기본값 있음)
 * @param {() => void} [props.onComplete] - 로딩 완료 시 호출되는 콜백 함수
 *
 * @example
 * <LoadingScreen
 *   duration={3000}
 *   imageSrc="/images/loading.png"
 *   progressBgColor="#E5E7EB"
 *   progressIndicatorColor="#3B82F6"
 *   onComplete={() => console.log("로딩 완료!")}
 * />
 */

/**
 * LoadingScreen 컴포넌트 props
 */
export interface LoadingProps {
  /** 총 로딩 시간(ms), 기본값 2000 */
  duration?: number;
  
  /** 화면 중앙에 표시할 이미지 경로, 기본값 "/logos/202X135.png" */
  imageSrc?: string;
  
  /** 프로그레스 바 배경색 (선택), 설정하지 않으면 기본색 사용 */
  progressBgColor?: string;
  
  /** 프로그레스 바 진행 색상 (선택), 설정하지 않으면 기본색 사용 */
  progressIndicatorColor?: string;
  
  /** 로딩 완료 시 호출되는 콜백 함수 (선택) */
  onComplete?: () => void;
}

export default function LoadingScreen({
    duration = 2000,
    imageSrc = "/logos/202X135.png",
    progressBgColor,
    progressIndicatorColor,
    onComplete,
}: LoadingProps) {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const next = Math.min((elapsed / duration) * 100, 100);
            setProgress(next);

            if (next < 100) {
                requestAnimationFrame(animate);
            } else {
                setProgress(100);
                setTimeout(() => {
                    onComplete?.(); // 완료 후 0.5초 딜레이
                }, 500);
            }
        };

        requestAnimationFrame(animate);
    }, [duration, onComplete]);

    return (
        <main className="h-100 flex flex-col justify-center items-center gap-6">
            {/* 가운데 이미지 */}
            <Image
                src={imageSrc}
                alt="loading"
                width={120}
                height={120}
                className="animate-pulse"
            />

            {/* 프로그레스 바 */}
            <div className="w-[90%]">
                <Progress
                    value={progress}
                    backgroundColor={progressBgColor}
                    indicatorColor={progressIndicatorColor}
                />
            </div>
        </main>
    );
}
