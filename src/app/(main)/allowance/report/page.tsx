"use client";
import { useState, useEffect } from "react";
import { Triangle } from "lucide-react";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useRouter } from "next/navigation";
import { HttpError } from "@/types/axios/httpError.t";
import { ApiResponse } from "@/types/axios/apiRes.t";
import SummaryCard from "@/components/custom/allowance/report/SummaryCard";
import { useUserStore } from "@/store/userStore";
import CategoryList from "@/components/custom/allowance/report/CategoryList";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import YearMonthSelector from "@/components/custom/allowance/report/YearMonthSelector";
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
  
  // Calculate previous month for initial state
  let initialYear = now.getFullYear();
  let initialMonth = now.getMonth(); // 0-based
  
  if (initialMonth === 0) {
    // If current month is January, previous month is December of last year
    initialYear = now.getFullYear() - 1;
    initialMonth = 12;
  }
  // Otherwise initialMonth is already the previous month (e.g., December=11 means November)
  
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedChildName, selectedChildId } = useSelectedChildStore();
  const { userType } = useUserStore();
  const isChild = userType === "child";

  const fetchUrl = isChild
    ? `/allowance/report`
    : `/allowance/${selectedChildId}/report`;
console.log("selectedChildId", selectedChildId);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<ReportData>>(fetchUrl, {
          params: { year, month },
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
  }, [year, month, router]);

  const handleDateChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setReport(null); // Clear report data immediately when date changes
  };

  const comparedTypeText =
    report?.comparedType === "more" ? "더 썼어요" : "아꼈어요";

  return (
    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden px-[27px] pb-[20px]">
      {/* ------ 상단 Header ------ */}
      <div className="flex flex-col mt-[16px]">
        <div className="flex items-center justify-between">
          <YearMonthSelector
            year={year}
            month={month}
            onChange={handleDateChange}
          />
          <span className="text-body-08 text-neutral-3">
            * 최근 1년(12개월)만 조회 가능
          </span>
        </div>
        <div className="flex items-center justify-center gap-[4px] text-head-01 text-neutral-1 mt-[12px]">
          <span>{selectedChildName}의</span>
          <span>{month}월</span>
          <span>소비리포트</span>
        </div>
      </div>
      {/* ------ 요약 카드 ------ */}
      <SummaryCard
        loading={loading}
        report={report}
        comparedTypeText={comparedTypeText}
        selectedMonth={month}
      />
      {/* ------ 카테고리 리스트 ------ */}
      <CategoryList loading={loading} report={report} />
    </div>
  );
}