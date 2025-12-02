"use client"

import { PushNotification } from "@/components/ui/notice/PushNotification"
import { useState } from "react"


export default function NoticeTest() {
  const [notificationOpen, setNotificationOpen] = useState(false)

  const handleShowNotification = () => {
    setNotificationOpen(true)
  }

  const handleNotificationClick = () => {
    alert("알림이 클릭되었습니다!")
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-head-01 text-[#343434]">푸시 알림 테스트</h1>

      <button
        onClick={handleShowNotification}
        className="rounded-lg bg-[#0067ac] px-6 py-3 text-body-04 text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80"
      >
        알림 표시하기
      </button>

      <PushNotification
        open={notificationOpen}
        setOpen={setNotificationOpen}
        message="자녀 등록이 완료되었습니다."
        timestamp="오전 8:59"
        onClick={handleNotificationClick}
      />
    </div>
  )
}
