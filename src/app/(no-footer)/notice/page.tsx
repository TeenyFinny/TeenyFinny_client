"use client"

import { useEffect, useState } from "react"
import { NotificationItem } from "@/components/ui/notice/NotificationItem"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

interface Notification {
  title: string
  created_at: string
  isRead: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await api.get(requests.fetchNotice)
  //       setNotifications(res.data.notifications)
  //     } catch (error) {
  //       console.error("알림 데이터를 불러오지 못했습니다:", error)
  //     }
  //   }
  //   fetchData()
  // }, [])

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await api.get(requests.fetchNotice, { signal: controller.signal });
        setNotifications(res.data.notifications);
      } catch (error) {

        console.error("알림 데이터를 불러오지 못했습니다:", error);

      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  // ✅ 클릭 시 읽음 처리
  const handleRead = (index: number) => {
    setNotifications(prev =>
      prev.map((n, i) =>
        i === index ? { ...n, isRead: true } : n
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
        {notifications.map((n, index) => (
          <div
            key={index}
            onClick={() => handleRead(index)} // ✅ 클릭 시 상태 변경
            className={`cursor-pointer transition-colors ${n.isRead ? "bg-transparent" : "bg-[rgba(0,103,172,0.15)]"
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
