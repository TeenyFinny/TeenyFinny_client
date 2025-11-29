"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { useNotificationStore } from "@/store/notificationStore"

/**
 * PushSettingPage
 *
 * 사용자 푸시 알림 설정 페이지 컴포넌트.
 * 서비스 알림 및 야간 알림 ON/OFF 토글을 제공하며,
 * 최초 진입 시 GET 요청으로 현재 설정을 불러오고,
 * 상태 변경 시 서버에 PATCH 요청으로 저장.
 *
 * @component
 * @example
 * return <PushSettingPage />
 */
export default function PushSettingPage() {
  const [pushEnabled, setPushEnabled] = useState(false)
  const [nightPushEnabled, setNightPushEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { setMessage } = useNotificationStore()

  // -------------------------------
  // 페이지 진입 시 GET 요청
  // -------------------------------
  useEffect(() => {
    ;(async () => {
      try {
        /**
         * GET /profile/push
         * @type {{ pushEnabled: boolean, nightPushEnabled: boolean }}
         */
        const res = await api.get(requests.fetchPushSettings)
        const data = res.data
        setPushEnabled(data.pushEnabled)
        setNightPushEnabled(data.nightPushEnabled)
      } catch (err) {
        console.error("알림 설정 불러오기 실패:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /**
   * handleToggle
   *
   * 토글 스위치 ON/OFF 이벤트 처리.
   * UI를 즉시 업데이트(optimistic update)하고 PATCH 요청으로 서버에 저장.
   * 실패 시 상태를 이전 값으로 롤백.
   *
   * @param {"pushEnabled" | "nightPushEnabled"} key - 업데이트할 설정 키
   * @param {boolean} value - 변경할 값
   * @param {(v: boolean) => void} setter - useState setter 함수
   */
  const handleToggle = async (key: "pushEnabled" | "nightPushEnabled", value: boolean, setter: (v: boolean) => void) => {
    const prev = !value
    setter(value) // UI 즉시 반영

    try {
      // PATCH /profile/push 엔드포인트로 요청
      await api.patch(requests.updatePush, { [key]: value })
      setMessage(key === "pushEnabled" ? "서비스 알림 설정이 변경되었습니다." : "야간 알림 설정이 변경되었습니다.")
    } catch (err: any) {
      console.error("알림 설정 변경 실패:", err)
      setter(prev) // 실패 시 롤백
      setMessage(err?.response?.data?.message || "알림 설정 변경에 실패했습니다.")
    }
  }

  if (loading) return <p className="text-center mt-10">로딩 중...</p>

  return (
    <main className="w-full h-full max-h-[500px]">
      {/* 상단 텍스트 */}
      <div className="px-6 mt-9">
        <h1 className="text-head-01 font-bold text-neutral-1 text-left">서비스 알림 설정</h1>
        <p className="mt-2 text-body-6 text-neutral-3 text-left leading-tight">
          알림을 켜두면 놓치지 않고 확인할 수 있어요.
          <br />밤 10시~아침 7시에도 푸시 알림을 받을 수 있어요.
        </p>
      </div>

      {/* 서비스 알림 박스 */}
      <div className="mt-6 flex justify-center">
        <div className="w-[327px] h-[80px] bg-white rounded-xl flex items-center justify-between px-5">
          <span className="text-body-5 text-neutral-1 font-semibold">서비스 알림 받기</span>
          <Switch checked={pushEnabled} onCheckedChange={(v) => handleToggle("pushEnabled", v, setPushEnabled)} />
        </div>
      </div>

      {/* 야간 알림 박스 */}
      <div className="mt-6 flex justify-center">
        <div className="w-[327px] h-[80px] bg-white rounded-xl flex items-center justify-between px-5">
          <span className="text-body-5 text-neutral-1 font-semibold">야간 시간대 알림 받기</span>
          <Switch checked={nightPushEnabled} onCheckedChange={(v) => handleToggle("nightPushEnabled", v, setNightPushEnabled)} />
        </div>
      </div>
    </main>
  )
}
