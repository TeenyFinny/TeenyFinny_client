"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { hasAuthToken } from "@/lib/auth/token"

/**
 * 로그인 여부를 검사하고, 미로그인 상태라면 지정한 경로로 리다이렉트하는 훅
 * - 기본 리다이렉트 경로: "/login"
 * - 반환값: 현재 인증 여부 (boolean)
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const router = useRouter()
  const isAuthenticated = hasAuthToken()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, redirectTo, router])

  return isAuthenticated
}
