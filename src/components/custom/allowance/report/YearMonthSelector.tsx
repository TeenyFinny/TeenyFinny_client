"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

interface YearMonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function YearMonthSelector({
  year,
  month,
  onChange,
}: YearMonthSelectorProps) {
  const START_YEAR = 2024;
  const START_MONTH = 12;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let limitYear = currentYear;
  let limitMonth = currentMonth === 0 ? 12 : currentMonth;

  const years = Array.from(
    { length: limitYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1).filter(
    (m) =>
      (year !== START_YEAR || m >= START_MONTH) &&
      (year !== limitYear || m <= limitMonth)
  );

  const handleYearChange = (newYear: number) => {
    let validMonths = months;
    const newMonth = validMonths.includes(month)
      ? month
      : validMonths[0];
    onChange(newYear, newMonth);
  };

  const handleMonthChange = (newMonth: number) => {
    onChange(year, newMonth);
  };

  return (
    <div className="flex items-center gap-[10px]">
      {/* YEAR */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-[4px] bg-neutral-7 shadow rounded-[8px] px-[12px] py-[6px] text-body-01 text-neutral-1 w-fit"
        >
          {year}년 <ChevronDown size={16} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="rounded-[12px] bg-neutral-7 shadow-lg border border-neutral-5 mt-[6px] z-[9999] min-w-[90px]" // ⬅️ z-index + 기본 width
        >
          {years.map((y) => (
            <DropdownMenuItem
              key={y}
              onClick={() => handleYearChange(y)}
              className="px-[14px] py-[12px] text-body-04 text-neutral-1 hover:bg-neutral-6 cursor-pointer"
            >
              {y}년
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MONTH */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-[4px] bg-neutral-7 shadow rounded-[8px] px-[12px] py-[6px] text-body-01 text-neutral-1 min-w-[68px]"
        >
          {month}월 <ChevronDown size={16} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="rounded-[12px] bg-neutral-7 shadow-lg border border-neutral-5 mt-[6px] z-[9999] min-w-[68px]" // ⬅️ z-index
        >
          {months.map((m) => (
            <DropdownMenuItem
              key={m}
              onClick={() => handleMonthChange(m)}
              className="px-[14px] py-[12px] text-body-04 text-neutral-1 hover:bg-neutral-6 cursor-pointer"
            >
              {m}월
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}