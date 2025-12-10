"use client";

export default function CategoryList({ loading, report }: any) {
  
  // 로딩 중에는 무조건 스켈레톤만 렌더링
  if (loading) {
    return (
      <div className="mt-[20px] bg-neutral-7 rounded-[24px] shadow px-[24px] py-[10px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between py-[10px] animate-pulse">
            <div className="w-[80px] h-[16px] bg-neutral-4 rounded" />
            <div className="w-[60px] h-[16px] bg-neutral-4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // 로딩이 끝났고 데이터 없을 때만 "소비내역 없음"
  const categories = report?.categories ?? [];

  return (
    <div className="mt-[20px] bg-neutral-7 rounded-[24px] shadow px-[24px] py-[10px]">
      {categories.length === 0 ? (
        <div className="flex justify-center items-center py-[40px] text-body-06 text-neutral-2">
          소비내역이 없습니다
        </div>
      ) : (
        categories.map((c: any, i: number) => (
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
