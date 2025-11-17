// app/(main)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { HttpError } from "@/types/axios/httpError.t";
import ParentDashboard from "@/components/custom/home/parent-dashboard/ParentDashboard";
import requests from "@/lib/axios/requests";
import api from "@/lib/axios/axios";
import type { ChildSummary } from "@/types/user";
import ChildDashboard from "@/components/custom/home/child-dashboard/ChildDashboard";

interface ParentDashboardState {
  balance: number;
  children: ChildSummary[];
}

interface HomeApiResponse {
  user: {
    user_id: number;
    name: string;
    role: string;
    email: string;
    balance?: number;
    children?: ChildSummary[];
  };
}

/**
 * 홈 페이지 엔트리 컴포넌트.
 * `/home` API를 호출해 사용자 정보를 불러오고 Zustand에 반영합니다.
 */
export default function Page() {
  const { userType, hasChildren } = useUserStore();
  const [parentData, setParentData] = useState<ParentDashboardState | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadUser = async () => {
      try {
        // 명시적 타입 지정 (HomeApiResponse)
        const res = await api.get<HomeApiResponse>(requests.fetchHome, {
          signal: controller.signal,
        });
        const userPayload = res.data?.user ?? {};

        // role → userType 변환
        const rawRole = userPayload.role?.toLowerCase() ?? null;
        const normalizedRole =
          rawRole === "parent" || rawRole === "child" ? rawRole : null;

        // 자녀 목록 추출
        const children: ChildSummary[] = Array.isArray(userPayload.children)
          ? userPayload.children.map((child) => ({
              user_id: Number(child.user_id ?? 0),
              name: child.name ?? "",
              balance: Number(child.balance ?? 0),
            }))
          : [];

        // Zustand 상태 갱신
        useUserStore
          .getState()
          .setUser(
            userPayload.name ?? "",
            normalizedRole,
            (userPayload as any).userId,
            children.length > 0
          );

        if (normalizedRole === "parent") {
          setParentData({
            balance: Number(userPayload.balance ?? 0),
            children,
          });
          setError(null);
        } else {
          setParentData(null);
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

  // === 상태별 렌더링 분기 ===
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary-4">
        <p className="text-body-01 text-color-neutral-2">불러오는 중...</p>
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

  if (userType === "parent" && parentData) {
    return (
      <div className="w-full bg-primary-4">
        <div className="mx-auto w-full max-w-[375px] px-4.5 pt-4">
          <ParentDashboard
            hasChildren={hasChildren}
            balance={parentData.balance}
            childAccounts={parentData.children}
          />
        </div>
      </div>
    );
  }

  if (userType === "child") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ChildDashboard
          data={{
            user: {
              user_id: 2,
              name: "김티니",
              role: "CHILD",
              email: "child@teenyfinny.com",
              total_balance: 10000,
              deposit_balance: 1000,
              investment_balance: 0,
              saving_balance: 9000,
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-body-01">로그인이 필요합니다.</p>
    </div>
  );
}
