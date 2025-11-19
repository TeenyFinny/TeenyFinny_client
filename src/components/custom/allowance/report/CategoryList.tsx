"use client";

export default function CategoryList({ loading, report }: any) {
  return (
    <div className="mt-[20px] bg-neutral-7 rounded-[24px] shadow px-[24px] py-[10px]">
      {loading
        ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between py-[10px] animate-pulse">
              <div className="w-[80px] h-[16px] bg-neutral-4 rounded" />
              <div className="w-[60px] h-[16px] bg-neutral-4 rounded" />
            </div>
          ))
        ) : (
          report?.categories.map((c: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-[8px]">
              <div>
                <p className="text-head-02 text-neutral-1">{c.category}</p>
                <p className="text-body-04 text-neutral-2">{c.percentage}%</p>
              </div>

              <p className="text-head-08 text-neutral-1">{c.amount}원</p>
            </div>
          ))
        )}
    </div>
  );
}
