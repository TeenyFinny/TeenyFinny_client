// app/(main-backless)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import { HttpError } from "@/types/axios/httpError.t";
import ParentDashboard from "@/components/custom/home/parent-dashboard/ParentDashboard";
import requests from "@/lib/axios/requests";
import api from "@/lib/axios/axios";
import type { HomeRes, ChildDto } from "@/types/home";
import ChildDashboard from "@/components/custom/home/child-dashboard/ChildDashboard";
import { useNotificationStore } from "@/store/notificationStore";
import { PushNotification } from "@/components/ui/notice/PushNotification";
import LoadingScreenSkeletonDashboard from "@/components/ui/LoadingScreenSkeletonDashboard";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";

interface ParentDashboardState {
  balance: string;
  children: ChildDto[];
}

/**
 * 홈 페이지 엔트리 컴포넌트.
 * `/home` API를 호출해 사용자 정보를 불러오고 Zustand에 반영합니다.
 */
export default function Page() {
  const router = useRouter();
  const { userType } = useUserStore();

  const { message, setMessage } = useNotificationStore();

  /** PushNotification 표시 여부 */
  const [open, setOpen] = useState(false);

  const [parentData, setParentData] = useState<ParentDashboardState | null>(
    null
  );
  const [childData, setChildData] = useState<HomeRes["user"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // ⭐ 추가됨: requestCompleted true인 자녀 목록
  const [completedChildren, setCompletedChildren] = useState<ChildDto[]>([]);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  /**
   * message 변화 감지 → PushNotification 실행
   */
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  /** 사용자 정보 로드 */
  useEffect(() => {
    const controller = new AbortController();

    const loadUser = async () => {
      try {
        // 명시적 타입 지정 (HomeRes)
        const res = await api.get<HomeRes>(requests.fetchHome, {
          signal: controller.signal,
        });
        const userPayload = res.data?.user ?? {};

        // role → userType 변환
        const rawRole = userPayload.role?.toLowerCase() ?? null;
        const normalizedRole =
          rawRole === "parent" || rawRole === "child" ? rawRole : null;

        // 자녀 목록 추출
        const children: ChildDto[] = Array.isArray(userPayload.children)
          ? userPayload.children.map((child) => ({
            userId: Number(child.userId ?? 0),
            name: child.name ?? "",
            // 쉼표가 포함된 문자열일 경우 제거하여 숫자로 변환 가능하게 함
            balance: String(child.balance ?? "0").replace(/,/g, ""),
            gender: Number(child.gender ?? 1),
          }))
          : [];
        console.log(children);
        // Zustand 상태 갱신
        useUserStore
          .getState()
          .setUser(
            userPayload.name ?? "",
            normalizedRole,
            (userPayload as any).userId,
            children.length > 0,
            children
          );

        // 자녀이면서 가족 연결이 없는 경우 가족 등록 페이지로 리다이렉트
        if (normalizedRole === "child" && sessionStorage.getItem("hasFamily") === "false") {
          router.replace("/family/info");
          return;
        }

        if (normalizedRole === "parent") {
          setParentData({
            balance: String(userPayload.balance ?? "0"),
            children,
          });
          setChildData(null);
          setError(null);
          // ⭐⭐ 부모일 때만 자녀 requestCompleted 조회 실행 ⭐⭐
          // fetchCompletedChildren(children);
        } else if (normalizedRole === "child") {
          // 자녀로 로그인 시 selectedChildStore 초기화
          sessionStorage.removeItem('teenfinny-selected-child');
          setChildData(userPayload);
          setParentData(null);
          setError(null);
        } else {
          setParentData(null);
          setChildData(null);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err instanceof HttpError) {
          console.error(
            `[HOME] 요청 실패 - ${err.statusCode} ${err.message}`,
            err
          );
          setError("데이터를 불러오지 못했습니다.");
        } else {
          console.error("사용자 정보를 불러오지 못했습니다.", err);
          setError("예기치 못한 오류가 발생했습니다.");
        }
        setParentData(null);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadUser();
    return () => controller.abort();
  }, []);

  // /**
  //    * ⭐ requestCompleted 조회 함수
  //    */
  // const fetchCompletedChildren = async (children: ChildDto[]) => {
  //   try {
  //     const results = await Promise.all(
  //       children.map(async (child) => {
  //         try {
  //           // 개별 요청 실패해도 전체 Promise.all 실패하지 않음
  //           const res = await api.get(requests.fetchChildQuiz(child.userId));
  //           console.log("응답", res.data);
  //           return {
  //             ...child,
  //             requestCompleted: res.data.requestCompleted,
  //           };
  //         } catch (err) {
  //           console.warn(`child ${child.userId} 조회 실패 (퀴즈 미생성일 수 있음)`, err);
  //           return {
  //             ...child,
  //             requestCompleted: false, // 실패한 아이는 false로 처리
  //           };
  //         }
  //       })
  //     );

  //     const completed = results.filter((child) => child.requestCompleted === true);

  //     if (completed.length > 0) {
  //       setCompletedChildren(completed);
  //       setShowCompletedModal(true);
  //     }
  //   } catch (err) {
  //     console.error("fetchCompletedChildren 전체 실패:", err);
  //   }
  // };


  // === 상태별 렌더링 분기 ===
  if (isLoading) {
    return (
      <div className="w-full bg-primary-4">
        <div className="mx-auto w-full max-w-[375px]">
          <LoadingScreenSkeletonDashboard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary-4">
        <p className="text-body-01 text-color-error">{error}</p>
      </div>
    );
  }

  return (
    <>
      <PushNotification
        open={open}
        setOpen={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setMessage(null);
        }}
        message={message ?? ""}
      />

      {/* ⭐ requestCompleted 모달 표시
      {showCompletedModal && (
         <ConfirmationDialog
        open={showCompletedModal}
        onOpenChange={setShowCompletedModal}
        title={`투자 계좌 개설 요청이 도착했어요!`}
        description={`${completedChildren.map((c) => c.name).join(", ")}\n아이 관리 탭에서 계좌를 만들어주세요!`}
        confirmText="확인"
      />
      )} */}

      {userType === "parent" && parentData ? (
        <div className="w-full bg-primary-4">
          <div className="mx-auto w-full max-w-[375px] px-4.5 pt-4">
            <ParentDashboard
              balance={parentData.balance}
              childAccounts={parentData.children}
            />
          </div>
        </div>
      ) : userType === "child" && childData ? (
        <div className="flex h-full w-full items-center justify-center">
          <ChildDashboard />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-body-01">로그인이 필요합니다.</p>
        </div>
      )}
    </>
  );
}
