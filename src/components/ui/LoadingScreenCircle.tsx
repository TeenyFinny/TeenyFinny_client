"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

/**
 * 원형 로딩 화면 컴포넌트
 *
 * 화면 중앙에 이미지를 표시하고, 그 주위를 원형 프로그레스바가
 * 채워지면서 로딩 진행 상태를 시각적으로 보여줍니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {() => void} [props.onComplete] - 로딩이 100% 완료되었을 때 호출되는 콜백 함수
 */
interface LoadingScreenCircleProps {
  /** 로딩 완료 시 호출되는 콜백 */
  onComplete?: () => void
}

export default function LoadingScreenCircle({ onComplete }: LoadingScreenCircleProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          onComplete?.() // 100% 도달 시 콜백 호출
          return 100
        }
        return prev + 1
      })
    }, 30)
    return () => clearInterval(interval)
  }, [onComplete])

  // Calculate stroke dash offset for circular progress
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex h-[500px] flex-col items-center justify-center bg-transparent px-4">
      {/* Main content */}
      <div className="flex flex-col items-center gap-8">
        {/* Text */}
        <div className="text-center">
          <h2 className="mb-1 font-sans text-xl font-bold text-gray-900">
            잠시만 기다려주세요
          </h2>
        </div>
        {/* Circular progress with avatar */}
        <div className="relative flex items-center justify-center">
          {/* SVG Circle Progress */}
          <svg className="h-64 w-64 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="#3B82F6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          {/* Avatar in center */}
          <div className="absolute flex items-center justify-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-white p-2">
              <Image
                src="/images/saving/illust_saving_1.png"
                alt="Profile avatar"
                width={160}
                height={160}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
