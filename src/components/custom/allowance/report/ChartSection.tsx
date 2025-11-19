"use client";

import { DonutChart } from "@/components/ui/invest/DonutChart";

export default function ChartSection({ loading, report }: any) {
  return (
    <div className="w-full flex justify-center items-center mt-[16px]">
      <DonutChart
        data={
          loading
            ? [] // 로딩 중일 때는 빈 배열 전달
            : report?.categories.map((c: any) => ({
                name: c.category,
                percentage: c.percentage,
              })) || []
        }
        size={176}
        innerRadius={20}
        outerRadius={75}
      />
    </div>
  );
}
