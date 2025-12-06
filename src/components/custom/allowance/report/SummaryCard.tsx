"use client";

import ChartSection from "./ChartSection";

interface Props {
  loading: boolean;
  report: any;
  comparedTypeText: string | null;
  selectedMonth: number;
}

export default function SummaryCard({ loading, report, comparedTypeText, selectedMonth }: Props) {
  
  const totalAmount = report?.totalAmount ?? "0";
  const comparedAmount = report?.comparedAmount ?? "0";

  return (
    <div className="bg-neutral-7 rounded-[24px] shadow px-[24px] py-[28px] mt-[24px]">
      <div className="flex flex-row">
        
        {/* --------- Left: Text Section --------- */}
        <div className="flex flex-col w-[45%]">
          <p className="text-head-05 text-neutral-1 mb-[12px]">
            {selectedMonth}월<br/>총 소비금액
          </p>

          {/* 총 금액 */}
          {loading ? (
            <div className="h-[32px] w-[120px] bg-neutral-4 rounded animate-pulse mb-[12px]" />
          ) : (
            <div className="h-[32px] mb-[12px] flex items-center">
              <p className="text-head-05 text-neutral-1 whitespace-nowrap">
                {totalAmount} 원
              </p>
            </div>
          )}

          {/* 지난 달 비교 */}
          <div className="pt-[21px] border-t border-neutral-4">
            <p className="text-body-06 text-neutral-1">지난 달보다</p>

            {loading ? (
              <div className="h-[24px] w-[100px] bg-neutral-4 rounded animate-pulse mt-[4px]" />
            ) : (
              <>
                <p className="text-head-05 text-neutral-1">{comparedAmount} 원</p>
                <p className="text-body-06 text-neutral-1">
                  {comparedTypeText ?? ""}
                </p>
              </>
            )}
          </div>
        </div>

        {/* --------- Right: Chart Section --------- */}
        <div className="flex-1 flex justify-center items-center">
          {loading ? (
            <div className="w-[130px] h-[130px] rounded-full bg-neutral-4 animate-pulse" />
          ) : report ? (
            <ChartSection loading={loading} report={report} />
          ) : (
            <div className="w-[130px] h-[130px] rounded-full bg-neutral-5 flex items-center justify-center text-neutral-3 text-body-06">
              데이터 없음
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
