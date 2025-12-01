"use client"

import { useRouter } from "next/navigation"
import { HeaderBarBackless } from "./HeaderBarBackless" // 새로 만든 뒤로가기 없는 헤더
import { useState } from "react"
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog"
import { useUserStore } from "@/store/userStore"
import { useSse } from "@/hooks/useSse"

/**
 * @typedef HeaderBarBacklessWrapperProps
 * @property {() => void} [onNotice] - 상위에서 주입할 수 있는 선택적 알림 콜백
 */
type HeaderBarBacklessWrapperProps = Readonly<{
  onNotice?: () => void
}>

/**
 * HeaderBarBacklessWrapper
 *
 * 뒤로가기 버튼이 없는 헤더바를 감싸는 래퍼 컴포넌트입니다.
 * - 로그인 여부에 따라 알림 버튼 클릭 시 동작이 다릅니다.
 * - 비로그인 상태에서는 모달을 표시합니다.
 * - 로그인 상태에서는 `/notice` 페이지로 이동합니다.
 */
const HeaderBarBacklessWrapper = ({ onNotice }: HeaderBarBacklessWrapperProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { userType } = useUserStore()
  useSse() // SSE 연결 활성화

  /**
   * 알림 버튼 클릭 핸들러
   * - onNotice prop이 전달되면 해당 콜백을 우선 실행
   * - 로그인 상태면 `/notice`로 이동
   * - 비로그인 상태면 모달 표시
   */
  const handleNotification = () => {
    if (onNotice) {
      onNotice()
      return
    }

    if (userType) {
      router.push("/notice")
    } else {
      setOpen(true)
    }
  }

  return (
    <div>
      <HeaderBarBackless onNotificationClick={handleNotification} />

      {open ? (
        <TitleOnlyDialog
          open={open}
          onOpenChange={(v) => setOpen(v)}
          title="로그인 후 사용해주세요."
          confirmText="확인"
          onConfirm={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}

export default HeaderBarBacklessWrapper
