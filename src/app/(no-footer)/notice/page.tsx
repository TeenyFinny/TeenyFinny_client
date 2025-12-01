"use client";

import { useEffect, useState } from "react"
import { NotificationItem } from "@/components/ui/notice/NotificationItem"
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog"
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  time: string;
  isRead: boolean;
}

import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", description: "" })
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null)
  const [children, setChildren] = useState<any[]>([])
  const [confirmAction, setConfirmAction] = useState<"CANCEL" | "COMPLETE" | null>(null)
  const [isGoalRequestModalOpen, setIsGoalRequestModalOpen] = useState(false)
  const [goalCreationData, setGoalCreationData] = useState({
    childName: "",
    period: 0,
    monthlyAmount: 0,
    totalAmount: 0
  })

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await api.get(requests.fetchNotices, {
          signal: controller.signal,
        });
        setNotifications(res.data);

        const homeRes = await api.get(requests.fetchHome, {
          signal: controller.signal,
        });
        if (homeRes.data.user.children) {
          setChildren(homeRes.data.user.children);
        }
      } catch (error: any) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          // 페이지 취소 에러는 return
          return;
        }
        console.error("알림 데이터를 불러오지 못했습니다:", error);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // ✅ 클릭 시 읽음 처리 (id 기준)
  const handleRead = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await api.patch(requests.markAsRead(notification.id));
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );

        // 목표 생성 요청 알림 클릭 시 모달 띄우기
        if (notification.type === "GOAL" && notification.title === "목표 생성 요청") {
          const childName = notification.content.split("(이)가")[0]
          const child = children.find((c: any) => c.name === childName)

          if (child) {
            try {
              const pendingRes = await api.get(requests.fetchChildPendingGoal(child.userId))
              const goalData = pendingRes.data
              setSelectedGoalId(goalData.id)

              const total = Number(goalData.targetAmount.replace(/,/g, ""))
              const monthly = Number(goalData.monthlyAmount.replace(/,/g, ""))
              const period = goalData.period

              setGoalCreationData({
                childName,
                period,
                monthlyAmount: monthly,
                totalAmount: total
              })

              setIsGoalRequestModalOpen(true)
            } catch (err) {
              console.error("목표 정보 조회 실패:", err)
              alert("목표 정보를 불러오는데 실패했습니다.")
            }
          }
        }

        // 목표 중도 해지 요청인 경우 모달 띄우기 (읽지 않은 상태일 때만)
        if (
          notification.type === "GOAL" &&
          notification.title === "목표 중도 해지 요청"
        ) {
          const childName = notification.content.split("(이)가")[0];
          setModalContent({
            title: `${childName}(이)가 목표 중도 해지를 요청했어요!`,
            description: "가까운 영업점에 방문하여 해지하세요.",
          });
          setConfirmAction("CANCEL"); // 액션 타입 설정

          // 자녀 이름으로 자녀 ID 찾기
          const child = children.find((c: any) => c.name === childName);
          if (child) {
            try {
              const goalRes = await api.get(
                requests.fetchChildGoal(child.userId)
              );
              setSelectedGoalId(goalRes.data);
            } catch (err) {
              console.error("목표 ID 조회 실패:", err);
            }
          }

          setIsDialogOpen(true);
        }

        // 목표 달성 완료 알림 클릭 시 모달 띄우기
        if (
          notification.type === "GOAL" &&
          notification.title === "목표 달성 완료"
        ) {
          const childName = notification.content.split("(이)가")[0];
          setModalContent({
            title: `${childName}(이)가 목표를 달성했습니다!`,
            description: "가까운 영업점에 방문하여 해지하세요.",
          });
          setConfirmAction("COMPLETE"); // 액션 타입 설정

          // 자녀 이름으로 자녀 ID 찾기
          const child = children.find((c: any) => c.name === childName);
          if (child) {
            try {
              const goalRes = await api.get(
                requests.fetchChildGoal(child.userId)
              );
              setSelectedGoalId(goalRes.data);
            } catch (err) {
              console.error("목표 ID 조회 실패:", err);
            }
          }

          setIsDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("읽음 처리 실패:", error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedGoalId) return;

    try {
      if (confirmAction === "CANCEL") {
        await api.put(requests.confirmCancel(selectedGoalId));
        alert("목표 취소가 확정되었습니다.");
      } else if (confirmAction === "COMPLETE") {
        await api.put(requests.confirmComplete(selectedGoalId));
        alert("목표 완료가 확정되었습니다.");
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("요청 처리 실패:", error);
      alert("요청 처리에 실패했습니다.");
    }
  };

  const handleGoalApprove = async () => {
    if (!selectedGoalId) return
    try {
      await api.patch(requests.approveGoal(selectedGoalId), { approve: true })
      alert("목표 생성을 승인했습니다.")
      setIsGoalRequestModalOpen(false)
    } catch (error) {
      console.error("승인 실패:", error)
      alert("승인 처리에 실패했습니다.")
    }
  }

  const handleGoalReject = async () => {
    if (!selectedGoalId) return
    try {
      await api.patch(requests.approveGoal(selectedGoalId), { approve: false })
      alert("목표 생성을 반려했습니다.")
      setIsGoalRequestModalOpen(false)
    } catch (error) {
      console.error("반려 실패:", error)
      alert("반려 처리에 실패했습니다.")
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
        {notifications.map((n) => (
          <div
            key={n.id} // ✅ id로 key 지정
            onClick={() => handleRead(n)} // ✅ 객체 전달
            className={`cursor-pointer transition-colors ${
              n.isRead ? "bg-transparent" : "bg-[rgba(0,103,172,0.15)]"
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

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={modalContent.title}
        description={modalContent.description}
        confirmText="확인"
        onConfirm={handleConfirm}
      />

      <DeleteConfirmDialog
        open={isGoalRequestModalOpen}
        onOpenChange={setIsGoalRequestModalOpen}
        title={`${goalCreationData.childName}(이)가 목표 계좌 개설을 원해요!`}
        description={
          <>
            {goalCreationData.period}달 간 {goalCreationData.monthlyAmount.toLocaleString()}원 씩<br />총 {goalCreationData.totalAmount.toLocaleString()}원을 모을 거예요!
          </>
        }
        ltBtnTxt="거절"
        rtBtnTxt="승인"
        onClickLtBtn={handleGoalReject}
        onClickRtBtn={handleGoalApprove}
      />
    </div>
  );
}
