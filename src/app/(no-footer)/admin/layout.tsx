'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useUserStore } from '@/store/userStore';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { userType } = useUserStore();

  // 로그인 여부 체크 (토큰 없으면 로그인 페이지로)
  useRequireAuth('/login');

  // ADMIN 이외의 사용자는 관리자 페이지 접근 차단
  useEffect(() => {
    if (!userType) return;
    if (userType !== 'admin') {
      router.replace('/home');
    }
  }, [userType, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
          <p className="mt-2 text-sm text-gray-600">
            자동이체 관리 및 실패 거래 조회
          </p>
        </div>
        
        <nav className="mb-8 flex gap-4 border-b border-gray-200">
          <a
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-blue-500"
          >
            대시보드
          </a>
          <a
            href="/admin/auto-transfer"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-blue-500"
          >
            자동이체 관리
          </a>
          <a
            href="/admin/failed-transactions"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-blue-500"
          >
            실패 거래 조회
          </a>
        </nav>

        {children}
      </div>
    </div>
  );
}
