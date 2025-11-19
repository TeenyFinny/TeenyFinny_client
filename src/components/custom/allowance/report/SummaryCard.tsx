"use client";

import { DonutChart } from "@/components/ui/invest/DonutChart";
import ChartSection from "./ChartSection";

interface Props {
  loading: boolean;
  report: any;
  comparedTypeText: string | null;
}

export default function SummaryCard({ loading, report, comparedTypeText }: Props) {
  return (
    <div className="bg-neutral-7 rounded-[24px] shadow px-[24px] py-[28px] mt-[24px]">
      <div className="flex flex-row">
        <div className="flex flex-col w-[45%]">
          <p className="text-head-05 text-neutral-1 mb-[12px]">
            {report?.month || ""}월<br/>총 소비금액
          </p>

          {loading ? (
            <div className="h-[32px] w-[120px] bg-neutral-4 rounded animate-pulse mb-[12px]" />
          ) : (
            <p className="text-head-01 text-neutral-1 mb-[12px] whitespace-nowrap">
              {report?.totalAmount} 원
            </p>
          )}

          <div className="pt-[21px] border-t border-neutral-4">
            <p className="text-body-06 text-neutral-1">지난 달보다</p>

            {loading ? (
              <div className="h-[24px] w-[100px] bg-neutral-4 rounded animate-pulse mt-[4px]" />
            ) : (
              <>
                <p className="text-head-05 text-neutral-1">
                  {report?.comparedAmount} 원
                </p>
                <p className="text-body-06 text-neutral-1">{comparedTypeText}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {loading ? (
            <div className="w-[130px] h-[130px] rounded-full bg-neutral-4 animate-pulse" />
          ) : (
            <ChartSection loading={loading} report={report} />
          )}
        </div>
      </div>
    </div>
  );
}
