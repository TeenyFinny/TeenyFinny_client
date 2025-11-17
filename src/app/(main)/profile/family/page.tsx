// src/app/(main)/profile/family/page.tsx
"use client"

import { ChildrenBadge } from "@/components/ui/badge/ChildrenBadge"
import { useUserStore } from "@/store/userStore"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * AddFamilyPage
 *
 * 부모 사용자가 등록된 자녀 목록을 확인하고,
 * 추가 가족 등록 페이지로 이동할 수 있는 화면입니다.
 *
 * - userType이 부모(parent)가 아닐 경우 홈으로 리다이렉트됩니다.
 * - 전역 사용자 상태(Zustand)에서 자녀 목록을 불러옵니다.
 * - 자녀가 있을 경우 ChildrenBadge 목록을 표시합니다.
 * - "가족 등록하기" 버튼 클릭 시 가족 등록 플로우로 이동합니다.
 */
export default function AddFamilyPage() {
  const router = useRouter()
  const userType = useUserStore((state) => state.userType)
  const children = useUserStore((state) => state.children)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && userType !== "parent") {
      router.replace("/home")
    }
  }, [mounted, userType, router])

  if (!mounted) return null

  return (
    <main className="px-6 overflow-y-auto">
      {/* 타이틀 */}
      <div className="flex flex-col">
        <div className="pt-[36px] pb-[10px] text-left flex items-center">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">가족 관리</h1>
        </div>
        <div className="text-left pb-[44px]">
          <p className="text-body-06 text-neutral-3 whitespace-pre-line">{`등록된 자녀를 관리할 수 있습니다.`}</p>
        </div>
      </div>

      {/* 자녀 목록 */}
      <div className="flex justify-start items-center w-full">
        {children.length > 0 ? (
          <div className="flex flex-wrap justify-start items-start gap-6">
            {children.map((child) => (
              <ChildrenBadge key={child.userId} name={child.name} gender={child.gender} childId={child.userId} currentChild={0} setCurrentChild={() => {}} disabled={true} />
            ))}
          </div>
        ) : (
          <p className="text-body-06 text-info">등록된 자녀가 없습니다.</p>
        )}
      </div>
      <div className="fixed bottom-[134px] w-full max-w-[327px]">
        <BigButtonActivated label="가족 등록하기" onClick={() => router.push("/family")} />
      </div>
    </main>
  )
}
