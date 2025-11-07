'use client'

import { useRouter } from "next/navigation"
import { HeaderBar } from "./HeaderBar"
import { useState } from "react"
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog"
import { useUserStore } from "@/store/userStore"

const HeaderbarWrapper = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { userType } = useUserStore()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back()
    else router.push("/")
  }

  const handleNotification = () => {
    if (userType) {
      router.push("/notice")
    } else {
      setOpen(true)
    }
  }

  return (
    <div>
      <HeaderBar onBackClick={handleBack} onNotificationClick={handleNotification} />

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

export default HeaderbarWrapper
