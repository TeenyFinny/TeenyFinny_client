// app/(main)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  fetchAndSetUser,
  type ChildSummary,
  type MappedUser,
} from "@/lib/utils/userMapper";
import { HttpError } from "@/types/axios/httpError.t";
import ParentDashboard from "@/components/custom/home/parent-dashboard/ParentDashboard";
import requests from "@/lib/axios/requests";
interface ParentDashboardState {
  balance: number;
  children: ChildSummary[];
}

/**
 * 홈 페이지 엔트리 컴포넌트.
 *
 * 부모/자녀 여부에 따라 각각의 대시보드를 렌더링하며,
 * 초기 마운트 시 `/home/parent` API를 호출해 Zustand 상태를 갱신합니다.
 *
 * @returns {JSX.Element} 홈 페이지 요소.
 */
export default function Page() {
  const { userType, hasChildren } = useUserStore();
  const [parentData, setParentData] = useState<ParentDashboardState | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        // 자녀 대시보드 API 테스트 후 최종 엔드포인트(/home)로 재조정 예정
        const mappedUser: MappedUser = await fetchAndSetUser(
          requests.fetchHome
        );
        if (!mounted) return;

        if (mappedUser.userType === "parent") {
          setParentData({
            balance: mappedUser.balance,
            children: mappedUser.children,
          });
        } else {
          setParentData(null);
        }
      } catch (error) {
        if (error instanceof HttpError) {
          console.error(
            `[HOME] 요청 실패 - ${error.statusCode} ${error.message}`,
            error
          );
        } else {
          console.error("사용자 정보를 불러오지 못했습니다.", error);
        }
        if (mounted) setParentData(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  if (userType === "parent") {
    if (isLoading || !parentData) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-primary-4">
          <p className="text-body-01 text-color-neutral-2">불러오는 중...</p>
        </div>
      );
    }

    return (
      <div className="w-full bg-primary-4">
        <div className="mx-auto w-full max-w-[375px] px-4.5 pt-4 pb-7.5">
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
        <p className="text-body-01">자녀 대시보드</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-body-01">로그인이 필요합니다.</p>
    </div>
  );
}
