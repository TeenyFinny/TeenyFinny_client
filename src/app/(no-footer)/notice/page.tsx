"use client"

import { useEffect, useState } from "react"
import { NotificationItem } from "@/components/ui/notice/NotificationItem"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

interface Notification {
  id: number                // ✅ id 추가
  title: string
  created_at: string
  isRead: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const res = await api.get(requests.fetchNotice, { signal: controller.signal })
        // ✅ id 포함된 mock 데이터 사용
        setNotifications(res.data.notifications)
      } catch (error) {
        console.error("알림 데이터를 불러오지 못했습니다:", error)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [])

  // ✅ 클릭 시 읽음 처리 (id 기준)
  const handleRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    )
  }

  return (
    <div className="h-[712px] bg-transparent">
      {/* Title */}
      <div className="px-6 py-6">
        <h1 className="text-head-01 text-neutral-1">알림함</h1>
      </div>

      {/* Notifications List */}
      <div>
        {notifications.map(n => (
          <div
            key={n.id} // ✅ id로 key 지정
            onClick={() => handleRead(n.id)} // ✅ id로 클릭 처리
            className={`cursor-pointer transition-colors ${
              n.isRead ? "bg-transparent" : "bg-[rgba(0,103,172,0.15)]"
            }`}
          >
            <NotificationItem
              message={n.title}
              time={n.created_at}
              isRead={n.isRead}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
