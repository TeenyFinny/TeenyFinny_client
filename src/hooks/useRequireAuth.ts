"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { hasAuthToken } from "@/lib/auth/token"

/**
 * 로그인 여부를 검사하고, 미로그인 상태라면 지정한 경로로 리다이렉트하는 훅
 * - 기본 리다이렉트 경로: "/login"
 * - Hydration mismatch 방지를 위해 클라이언트에서만 인증 체크 수행
 * - 레이아웃에서는 항상 렌더링하고, 리다이렉트는 이 훅 내부에서만 처리
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const router = useRouter()

  useEffect(() => {
    // 클라이언트에서만 인증 체크 수행 (Hydration mismatch 방지)
    if (!hasAuthToken()) {
      router.replace(redirectTo)
    }
  }, [redirectTo, router])
}
