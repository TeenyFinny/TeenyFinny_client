"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl bg-neutral-7 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-h-[180px] flex flex-col justify-between">
        <div>
          <h2 className="text-head-04 text-neutral-1 mb-2">자동이체 관리</h2>
          <p className="text-body-07 text-neutral-3">
            전체 자동이체를 조회하고, 선택한 항목을 즉시 실행할 수 있어요.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/admin/auto-transfer"
            className="inline-flex items-center justify-center w-full h-[44px] rounded-[12px] bg-primary-1 text-neutral-7 text-body-05"
          >
            자동이체 목록 보기
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-7 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-h-[180px] flex flex-col justify-between">
        <div>
          <h2 className="text-head-04 text-neutral-1 mb-2">실패 거래 조회</h2>
          <p className="text-body-07 text-neutral-3">
            자동이체 실패 내역과 기타 실패 거래를 한 번에 확인해요.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/admin/failed-transactions"
            className="inline-flex items-center justify-center w-full h-[44px] rounded-[12px] bg-primary-1 text-neutral-7 text-body-05"
          >
            실패 거래 목록 보기
          </Link>
        </div>
      </section>
    </div>
  );
}


