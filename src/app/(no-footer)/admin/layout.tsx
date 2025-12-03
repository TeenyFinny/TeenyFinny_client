"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { userType } = useUserStore();

  // 로그인 여부 체크 (토큰 없으면 로그인 페이지로)
  useRequireAuth("/login");

  // ADMIN 이외의 사용자는 관리자 페이지 접근 차단
  useEffect(() => {
    if (!userType) return;
    if (userType !== "admin") {
      router.replace("/home");
    }
  }, [userType, router]);

  return (
    // (no-footer)/layout.tsx 안의 모바일 375px 프레임 기준으로 내부 컨텐츠만 구성
    <div className="w-full h-full bg-primary-4 px-4 pt-4 pb-6 overflow-y-auto">
      {/* 상단 타이틀 영역 */}
      <header className="mb-6">
        <h1 className="text-head-03 text-neutral-1">관리자 페이지</h1>
        <p className="mt-1 text-body-07 text-neutral-3">
          자동이체 관리 및 실패 거래 조회
        </p>
      </header>

      {/* 탭 네비게이션 */}
      <nav className="mb-4 flex gap-2 border-b border-neutral-5 pb-2">
        <Link
          href="/admin"
          className="px-3 py-1.5 rounded-full text-body-07 text-neutral-1 bg-neutral-6"
        >
          대시보드
        </Link>
        <Link
          href="/admin/auto-transfer"
          className="px-3 py-1.5 rounded-full text-body-07 text-neutral-1 bg-neutral-6"
        >
          자동이체
        </Link>
        <Link
          href="/admin/failed-transactions"
          className="px-3 py-1.5 rounded-full text-body-07 text-neutral-1 bg-neutral-6"
        >
          실패 거래
        </Link>
      </nav>

      {/* 컨텐츠 카드 영역 */}
      <section className="mt-2 rounded-2xl bg-neutral-7 p-4 h-[calc(100%-120px)] overflow-y-auto">
        {children}
      </section>
    </div>
  );
}


