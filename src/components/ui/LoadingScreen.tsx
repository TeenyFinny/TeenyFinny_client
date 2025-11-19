"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

/**
 * LoadingScreen Props
 *
 * 로딩 화면을 구성하며, 중앙 이미지 + 하단 프로그레스 바가 표시됩니다.
 * 지정된 `duration` 동안 0 → 100%까지 자연스럽게 증가하고,
 * 로딩 완료 후 0.5초 뒤 `onComplete` 콜백이 호출됩니다.
 *
 * @typedef {Object} LoadingProps
 * @property {number} [duration=2000] - 총 로딩 시간(ms)
 * @property {string} [imageSrc="/logos/202X135.png"] - 중앙 로딩 이미지 경로
 * @property {string} [progressBgColor] - 프로그레스 바 배경색
 * @property {string} [progressIndicatorColor] - 프로그레스 바 진행 색상
 * @property {() => void} [onComplete] - 로딩 종료 후 실행되는 콜백
 */

/**
 * @interface LoadingProps
 * LoadingScreen 컴포넌트 Props
 */
export interface LoadingProps {
  /** 총 로딩 시간(ms), 기본값 2000 */
  duration?: number;

  /** 로딩 화면 중앙에 표시될 이미지 경로 */
  imageSrc?: string;

  /** 프로그레스 바 배경색 */
  progressBgColor?: string;

  /** 프로그레스 바 진행 색상 */
  progressIndicatorColor?: string;

  /** 로딩 완료 후 호출되는 콜백 함수 */
  onComplete?: () => void;
}

/**
 * LoadingScreen 컴포넌트
 *
 * @description
 * 일정 시간 동안 자연스럽게 차오르는 로딩 화면을 제공합니다.
 * 로딩 완료 시 `onComplete` 콜백이 실행되며, 0.5초 딜레이가 있습니다.
 *
 * @param {LoadingProps} props - 컴포넌트 Props
 *
 * @example
 * <LoadingScreen
 *   duration={3000}
 *   imageSrc="/images/loading.png"
 *   progressBgColor="#E5E7EB"
 *   progressIndicatorColor="#3B82F6"
 *   onComplete={() => console.log("로딩 끝!")}
 * />
 */
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
      const nextValue = Math.min((elapsed / duration) * 100, 100);

      setProgress(nextValue);

      if (nextValue < 100) {
        requestAnimationFrame(animate);
      } else {
        setProgress(100);

        // 0.5초 딜레이 후 콜백 실행
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  }, [duration, onComplete]);

  return (
    <div className=" flex flex-col justify-center items-center gap-3">
      {/* 중앙 로딩 이미지 */}
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
    </div>
  );
}
