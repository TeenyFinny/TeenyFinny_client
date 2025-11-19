"use client";

import { DonutChart } from "@/components/ui/invest/DonutChart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { ApiResponse } from "@/types/axios/apiRes.t";

interface Category {
  category: string;
  amount: string;
  percentage: number;
}

interface ReportData {
  month: number;
  totalAmount: string;
  comparedAmount: string;
  comparedType: "more" | "less";
  categories: Category[];
}

export default function Page() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<ReportData>>(
          requests.fetchReport,
          {
            params: {
              month: month,
            },
          }
        );
        // ✅ 인터셉터가 res.data를 반환하므로
        const data = res.data as ReportData;
        if (!data) throw new Error("No Report data found");

        setReport(data);
      } catch (e) {
        const err = e as HttpError;
        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          console.error("리포트 조회 실패:", err);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [month, router]); // ✅ 의존성 배열 수정

  const prevMonth = () => setMonth((prev) => (prev === 1 ? 12 : prev - 1));
  const nextMonth = () => setMonth((prev) => (prev === 12 ? 1 : prev + 1));

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-body-04 text-neutral-3">로딩중...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-body-04 text-neutral-3">소비 리포트 정보 없음</p>
      </div>
    );
  }

  // comparedType 한글 변환
  const comparedTypeText = report.comparedType === "more" ? "더 사용" : "덜 사용";

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-4 pb-20">
      {/* 월 이동 */}
      <div className="flex justify-center items-center gap-6 mt-4 mb-6">
        <button 
          onClick={prevMonth}
          className="text-2xl text-neutral-2 hover:text-neutral-1"
        >
          ◀
        </button>
        <span className="text-xl font-bold text-neutral-1">{month}월</span>
        <button 
          onClick={nextMonth}
          className="text-2xl text-neutral-2 hover:text-neutral-1"
        >
          ▶
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="p-6 bg-white rounded-3xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          {/* 왼쪽 텍스트 */}
          <div className="flex-1 pr-4">
            <p className="text-body-05 text-neutral-3 mb-2">
              {month}월 소비 내역
            </p>

            <p className="text-head-01 text-neutral-1 mb-4">
              {report.totalAmount}원
            </p>

            <div className="border-t border-neutral-5 pt-4">
              <p className="text-body-06 text-neutral-3 mb-1">저번 달보다</p>

              <p className="text-head-03 text-neutral-1">
                {report.comparedAmount}원
              </p>

              <p className="text-body-06 text-neutral-3 mt-1">
                {comparedTypeText}
              </p>
            </div>
          </div>

          {/* 오른쪽 도넛 차트 */}
          <DonutChart
            data={report.categories.map((c) => ({
              name: c.category,
              percentage: c.percentage,
            }))}
            size={176}
            innerRadius={20}
            outerRadius={75}
          />
        </div>
      </div>

      {/* 카테고리 리스트 */}
      <div className="space-y-3 bg-white rounded-2xl shadow-sm p-4">
        {report.categories.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-neutral-6 last:border-0"
          >
            <div>
              <p className="text-head-04 text-neutral-1">{c.category}</p>
              <p className="text-body-07 text-neutral-3">{c.percentage}%</p>
            </div>

            <p className="text-head-05 text-neutral-1">{c.amount}원</p>
          </div>
        ))}
      </div>
    </div>
  );
}