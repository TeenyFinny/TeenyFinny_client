"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios/axios";
import { useRouter } from "next/navigation";
import { HttpError } from "@/types/axios/httpError.t";
import { ApiResponse } from "@/types/axios/apiRes.t";
import SummaryCard from "@/components/custom/allowance/report/SummaryCard";
import { useUserStore } from "@/store/userStore";
import CategoryList from "@/components/custom/allowance/report/CategoryList";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import YearMonthSelector from "@/components/custom/allowance/report/YearMonthSelector";
import requests from "@/lib/axios/requests";
import { useSearchParams } from "next/navigation";
import FeedbackInput from "@/components/custom/allowance/report/FeedbackInput";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";

interface Category {
  category: string;
  amount: string;
  percentage: number;
}

interface ReportData {
  reportId: number;
  month: number;
  totalAmount: string;
  comparedAmount: string;
  comparedType: "more" | "less";
  categories: Category[];
}

interface FeedbackData {
  feedbackId?: number;
  message: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const now = new Date();

  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  let initialYear = yearParam ? Number(yearParam) : now.getFullYear();
  let initialMonth = monthParam ? Number(monthParam) : now.getMonth();

  // monthParam이 존재할 때는 0 기반(month-1) 처리 필요 없음
  if (!monthParam) {
    if (initialMonth === 0) {
      initialYear -= 1;
      initialMonth = 12;
    }
  }
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const router = useRouter();
  const { selectedChildName, selectedChildId } = useSelectedChildStore();
  const { userType, userName } = useUserStore();
  const isChild = userType === "child";

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [textInput, setTextInput] = useState("");

  const fetchReportUrl = isChild
    ? `/allowance/report`
    : `/allowance/${selectedChildId}/report`;

  /** 날짜 바뀔 때 초기화 */
  const handleDateChange = (newYear: number, newMonth: number) => {
    setLoading(true); // 날짜 변경 시 로딩 상태로 전환하여 "내역 없음" 깜빡임 방지
    setYear(newYear);
    setMonth(newMonth);

    setReport(null);
    setFeedback(null);
    setHasFeedback(false);
  };

  /** -------------------------------
   *   리포트 + 피드백 조회 useEffect
   -------------------------------- */
  useEffect(() => {
    (async () => {
      // 부모인데 자녀 ID가 없으면 조회하지 않음 (초기 로딩 시 깜빡임 방지)
      if (!isChild && !selectedChildId) return;

      try {
        setLoading(true);

        // 리포트 조회
        const res = await api.get<ApiResponse<ReportData>>(fetchReportUrl, {
          params: { year: year, month: month },
        });
        
        // 리포트 데이터 확인
        const reportData = res.data as ReportData;
        if(!reportData) throw new Error("No Report data found");
        setReport(reportData);

        // 피드백 조회
        // 피드백 조회
      if (reportData.reportId) {
        setFeedbackLoading(true);
        const fbRes = await api.get<ApiResponse<FeedbackData>>(requests.fetchFeedback, {
          params: { reportId: reportData.reportId },
        });

        const feedbackData = fbRes.data as FeedbackData;

        if (!feedbackData || !feedbackData.feedbackId) {
          // 피드백 없음
          setHasFeedback(false);
          setFeedback(null);
          setTextInput("");
        } else {
          // 피드백 있음
          setHasFeedback(true);
          setFeedback(feedbackData);
          setTextInput(feedbackData.message);
        }
      }
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
        setFeedbackLoading(false);
      }
    })();
  }, [year, month, router, isChild, selectedChildId]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /** -------------------------------
   *   피드백 전송
   -------------------------------- */
  const handleSendFeedback = async () => {
    if (!report?.reportId || !textInput.trim()) return;

    try {
      setIsSendingFeedback(true);
      const res = await api.post<ApiResponse<FeedbackData>>(requests.saveFeedback, {
        reportId: report.reportId,
        message: textInput.trim(),
      });

      const fbData = res.data as FeedbackData;

      setFeedback(fbData); 
      setHasFeedback(true);
      setIsDialogOpen(true);
    } catch (e) {
      const err = e as HttpError;
      alert(err.message ?? "피드백 전송에 실패했습니다.");
    }
    finally {
      setIsSendingFeedback(false); 
    }
  };

  /** -------------------------------
   *   리포트 비교문구
   -------------------------------- */
  const comparedTypeText =
    report?.comparedType === "more" ? "더 썼어요" : "아꼈어요";

  return (
    <div className="h-full overflow-y-auto px-[27px] pb-[20px] [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-[4px] text-head-01 text-neutral-1 mt-[20px]">
          <span>{isChild ? userName : selectedChildName}의</span>
          <span>{month}월</span>
          <span>소비리포트</span>
        </div>
        <div className="flex items-center justify-between mt-[16px]">
          <YearMonthSelector
            year={year}
            month={month}
            onChange={handleDateChange}
          />
          <span className="text-body-08 text-neutral-3">
            * 최근 1년(12개월)만 조회 가능
          </span>
        </div>
      </div>

      {/* Summary */}
      <SummaryCard
        loading={loading}
        report={report}
        comparedTypeText={comparedTypeText}
        selectedMonth={month}
      />

      {/* Category List */}
      <CategoryList loading={loading} report={report} />

      {/* Feedback */}
      {!loading && report && (!isChild || hasFeedback) && (
      <FeedbackInput
        label="부모님의 한 줄 피드백"
        value={textInput}
        onChange={(v) => {
          if (!isChild && !hasFeedback) {
            setTextInput(v)
          }
        }}
        onSend={handleSendFeedback}
        isChild={isChild}
        disabled={isChild || hasFeedback || feedbackLoading}
        isSending={isSendingFeedback}
        placeholder="자녀에게 피드백을 남겨주세요"
      />
    )}
    
    <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="자녀에게 알림을 보냈어요!"
        description="소비 리포트에서 메시지를 확인할 수 있어요"
        confirmText="확인"
        onConfirm={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
