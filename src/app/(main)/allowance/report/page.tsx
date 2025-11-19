"use client";

import { DonutChart } from "@/components/ui/invest/DonutChart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@/types/axios/httpError.t";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { useAccountHistoryStore } from "@/store/historyStore";

// 루시드 아이콘
import { Triangle } from "lucide-react";

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

  const { childName } = useAccountHistoryStore();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<ReportData>>(
          requests.fetchReport,
          {
            params: { month },
          }
        );

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
  }, [month, router]);

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
      <div className="flex justify-center items-center">
        <p className="text-body-04 text-neutral-3">소비 리포트 정보 없음</p>
      </div>
    );
  }

  const comparedTypeText =
    report.comparedType === "more" ? "더 썼어요" : "아꼈어요";

  return (
    <div className="px-[27px] pb-[20px]">
      {/* ---------- 상단 헤더 ---------- */}
      <div className="flex flex-col items-center gap-[8px] mt-[16px]">
        <div className="flex items-center gap-[4px] text-head-01 text-neutral-1">
          <span>{childName}의</span>

          {/* 이전 달 */}
          {month > 1 ? (
            <Triangle
              size={17}
            className="cursor-pointer text-neutral-2 fill-neutral-2 rotate-270"
            onClick={prevMonth}
            />
          ) : (
            <span className="w-[17px] h-[17px]" /> // 자리를 유지하기 위한 빈 박스
          )}

          <span>{month}월</span>

          {/* 다음 달(전월까지만 보여주기 때문에 현재 달일 때는 숨김) */}
          {month < now.getMonth() || month < 12 ? (
            <Triangle
              size={17}
              className="cursor-pointer text-neutral-2 fill-neutral-2 rotate-90"
              onClick={nextMonth}
            />
          ) : (
            <span className="w-[17px] h-[17px]" /> // 자리를 유지하기 위한 빈 박스
          )}

          <span>소비리포트</span>
        </div>
      </div>

      {/* ---------- 요약 카드 ---------- */}
      <div className="bg-neutral-7 rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] px-[24px] py-[28px] mt-[24px]">
        <div className="flex flex-row">
          {/* LEFT SECTION */}
          <div className="flex flex-col w-[45%] pr-[16px]">
            {/* 제목 */}
            <p className="text-head-05 text-neutral-1 mb-[12px]">
              {report.month}월
              <br />총 소비금액
            </p>

            {/* 총 금액 */}
            <p className="text-head-01 text-neutral-1 mb-[12px]">
              <span className="whitespace-nowrap">{report.totalAmount}원</span>
            </p>

            {/* 지난 달과 비교 */}
            <div className="pt-[11px] border-t border-neutral-4">
              <p className="text-body-06 text-neutral-1">지난 달보다</p>

              <p className="text-head-02 text-neutral-1">
                {report.comparedAmount}원
              </p>

              <p className="text-body-06 text-neutral-1">{comparedTypeText}</p>
            </div>
          </div>

          {/* RIGHT SECTION (차트) */}
          <div className="w-[55%] flex justify-center items-center translate-y-[8px]">
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
      </div>

      {/* ---------- 카테고리 리스트 ---------- */}
      <div className="mt-[20px] bg-neutral-7 rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] px-[24px] py-[10px]">
        {report.categories.map((c, i) => (
          <div key={i} className="flex items-center justify-between py-[8px]">
            <div>
              <p className="text-head-02 text-neutral-1">{c.category}</p>
              <p className="text-body-04 text-neutral-2">{c.percentage}%</p>
            </div>

            <p className="text-head-08 text-neutral-1">{c.amount}원</p>
          </div>
        ))}
      </div>
    </div>
  );
}
