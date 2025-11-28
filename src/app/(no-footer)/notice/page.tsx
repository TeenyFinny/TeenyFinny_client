"use client"

import { useEffect, useState } from "react"
import { NotificationItem } from "@/components/ui/notice/NotificationItem"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

interface Notification {
  id: number
  title: string
  content: string
  time: string
  isRead: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const res = await api.get(requests.fetchNotices, { signal: controller.signal })
        setNotifications(res.data)
      } catch (error) {
        console.error("알림 데이터를 불러오지 못했습니다:", error)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [])

  // ✅ 클릭 시 읽음 처리 (id 기준)
  const handleRead = async (id: number) => {
    try {
      await api.patch(requests.markAsRead(id))
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      )
    } catch (error) {
      console.error("읽음 처리 실패:", error)
    }
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
            className={`cursor-pointer transition-colors ${n.isRead ? "bg-transparent" : "bg-[rgba(0,103,172,0.15)]"
              }`}
          >
            <NotificationItem
              message={n.title}
              content={n.content}
              time={n.time}
              isRead={n.isRead}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
