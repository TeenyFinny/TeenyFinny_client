"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

/**
 * LoadingScreenCircle 컴포넌트 Props
 *
 * @property {() => void} [onComplete] - 로딩 완료 후 0.5초 뒤 호출되는 콜백 함수
 */
interface LoadingScreenCircleProps {
  /** 로딩 완료 후 호출되는 콜백 */
  onComplete?: () => void
}

/**
 * 원형 로딩 화면 컴포넌트
 *
 * 중앙 이미지를 기준으로 원형 프로그레스바가 채워지며,
 * 100% 완료되면 텍스트가 "완료!"로 변경되고 0.5초 뒤 onComplete 콜백이 실행됩니다.
 *
 * @component
 * @param {LoadingScreenCircleProps} props - 컴포넌트 Props
 * @returns JSX.Element
 */
export default function LoadingScreenCircle({ onComplete }: LoadingScreenCircleProps) {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDone(true)

          // 0.5초 후 콜백 실행
          setTimeout(() => {
            onComplete?.()
          }, 500)

          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  // 원형 프로그레스 계산
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex h-[500px] flex-col items-center justify-center bg-transparent px-4">
      <div className="flex flex-col items-center gap-8">
        {/* Text */}
        <div className="text-center">
          <h2 className="mb-1 font-sans text-xl font-bold text-gray-900">
            {isDone ? "완료!" : "가족관계 확인 중..."}
          </h2>
        </div>

        {/* Circular progress */}
        <div className="relative flex items-center justify-center">
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

          {/* Avatar */}
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
