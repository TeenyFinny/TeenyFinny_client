"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword"
import MyPageItem from "./MyPageItem"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

/**
 * MyPageBase
 *
 * 마이페이지(부모/자녀 공통)의 기본 레이아웃과 비밀번호 인증 로직을 담당하는 컴포넌트입니다.
 * ParentMyPage, ChildMyPage는 메뉴 구성만 주입하며,
 * 공통적인 인증 처리 및 라우팅은 본 컴포넌트에서 수행합니다.
 *
 * 기능:
 * - 메뉴 배열을 받아 각 항목을 MyPageItem으로 렌더링
 * - requireAuth가 true인 메뉴 클릭 시 간편 비밀번호 BottomSheet 표시
 * - 비밀번호 인증 성공 시 대기 중이던 경로로 이동
 *
 * props:
 * @param {Readonly<MenuItem[]>} menu - 라벨, 이동 경로, 인증 여부(requireAuth)를 가진 메뉴 리스트
 *
 * 내부 동작:
 * - isPasswordModalOpen: 비밀번호 바텀시트 열림/닫힘 상태 관리
 * - pendingRoute: 인증 완료 후 이동할 경로 저장
 * - handlePasswordComplete: 인증 요청 및 성공 시 라우팅 처리
 * - handleNavigateWithAuth: 인증 필요한 메뉴 클릭 시 바텀시트 활성화
 *
 * 사용 컴포넌트:
 * - MyPageItem: 메뉴 아이템 UI
 * - BottomSheetPassword: 간편 비밀번호 입력 UI
 */
export interface MenuItem {
  label: string
  route: string
  requireAuth?: boolean
}

interface MyPageBaseProps {
  menu: Readonly<MenuItem[]>
}

export default function MyPageBase({ menu }: MyPageBaseProps) {
  const router = useRouter()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [pendingRoute, setPendingRoute] = useState<string | null>(null)

  const handlePasswordComplete = async (simplePassword: string) => {
    try {
      const res = await api.post(requests.simplePassword, {
        password: simplePassword,
      })

      if (res.data?.matched === true) {
        setIsPasswordModalOpen(false)
        if (pendingRoute) {
          router.push(pendingRoute)
          setPendingRoute(null)
        }
      } else {
        throw new Error("간편 비밀번호가 일치하지 않습니다.")
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("간편 비밀번호 인증 실패:", err)
      }
      throw new Error("간편 비밀번호 인증에 실패했습니다.")
    }
  }

  const handleNavigateWithAuth = (route: string) => {
    setPendingRoute(route)
    setIsPasswordModalOpen(true)
  }

  return (
    <>
      <main className="px-[27px] pt-4 flex flex-col gap-[24px]">
        {menu.map((item) => (
          <MyPageItem key={item.label} label={item.label} onClick={() => (item.requireAuth ? handleNavigateWithAuth(item.route) : router.push(item.route))} />
        ))}
      </main>

      <BottomSheetPassword
        open={isPasswordModalOpen}
        setOpen={(open) => {
          setIsPasswordModalOpen(open)
          if (!open) setPendingRoute(null)
        }}
        onComplete={handlePasswordComplete}
        title="간편 비밀번호"
        shouldOverlayBottomBar={true}
      />
    </>
  )
}
