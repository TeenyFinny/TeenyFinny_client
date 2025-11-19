"use client";

import { useState, useEffect } from "react";
import { Triangle } from "lucide-react";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useRouter } from "next/navigation";
import { HttpError } from "@/types/axios/httpError.t";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { useAccountHistoryStore } from "@/store/historyStore";
import SummaryCard from "@/components/custom/allowance/report/SummaryCard";
import ChartSection from "@/components/custom/allowance/report/ChartSection";
import CategoryList from "@/components/custom/allowance/report/CategoryList";


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
  const [month, setMonth] = useState(now.getMonth() + 1);
const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { childName } = useAccountHistoryStore();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await api.get<ApiResponse<ReportData>>(requests.fetchReport, {
          params: { month },
        });

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

  const comparedTypeText =
    report?.comparedType === "more" ? "더 썼어요" : "아꼈어요";

  return (
    <div className="px-[27px] pb-[20px]">

      {/* ------ 상단 Header ------ */}
      <div className="flex flex-col items-center gap-[8px] mt-[16px]">
        <div className="flex items-center gap-[4px] text-head-01 text-neutral-1">
          <span>{childName}의</span>

          {month > 1 ? (
            <Triangle
              size={17}
              className="cursor-pointer text-neutral-2 fill-neutral-2 rotate-270"
              onClick={prevMonth}
            />
          ) : (
            <span className="w-[17px] h-[17px]" />
          )}

          <span>{month}월</span>

          {month < now.getMonth() ? (
            <Triangle
              size={17}
              className="cursor-pointer text-neutral-2 fill-neutral-2 rotate-90"
              onClick={nextMonth}
            />
          ) : (
            <span className="w-[17px] h-[17px]" />
          )}

          <span>소비리포트</span>
        </div>
      </div>

      {/* ------ 요약 카드 ------ */}
      <SummaryCard
        loading={loading}
        report={report}
        comparedTypeText={comparedTypeText}
      />

      {/* ------ 카테고리 리스트 ------ */}
      <CategoryList loading={loading} report={report} />

    </div>
  );
}
