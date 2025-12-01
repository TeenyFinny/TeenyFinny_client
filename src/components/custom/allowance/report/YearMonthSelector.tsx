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
  const currentMonth = now.getMonth(); // 0-based, so this is actually previous month when we add 1 later
  
  // Calculate previous month for the limit
  let limitYear = currentYear;
  let limitMonth = currentMonth; // This is 0-based, so getMonth() in December (11) means November is the limit
  
  if (limitMonth === 0) {
    // If current month is January (0), previous month is December of last year
    limitYear = currentYear - 1;
    limitMonth = 12;
  }
  // If currentMonth > 0, limitMonth is already correct (e.g., December=11 means limit is November=11)

  // Generate available years
  const availableYears: number[] = [];
  for (let y = START_YEAR; y <= limitYear; y++) {
    availableYears.push(y);
  }

  // Generate available months based on selected year
  const getAvailableMonths = (selectedYear: number): number[] => {
    const months: number[] = [];
    const startM = selectedYear === START_YEAR ? START_MONTH : 1;
    const endM = selectedYear === limitYear ? limitMonth : 12;

    for (let m = startM; m <= endM; m++) {
      months.push(m);
    }
    return months;
  };

  const availableMonths = getAvailableMonths(year);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number(e.target.value);
    const newAvailableMonths = getAvailableMonths(newYear);
    
    // If current month is not available in new year, select the first available month
    const newMonth = newAvailableMonths.includes(month)
      ? month
      : newAvailableMonths[0];
    
    onChange(newYear, newMonth);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    onChange(year, newMonth);
  };

  return (
    <div className="flex items-center gap-[8px]">
      {/* Year Selector */}
      <div className="relative inline-block">
        <select
          value={year}
          onChange={handleYearChange}
          className="appearance-none bg-neutral-7 shadow rounded-[8px] pl-3 pr-8 py-2 text-body-01 text-neutral-1 font-medium focus:outline-none cursor-pointer"
        >
          {availableYears.map((y) => (
            <option key={y} value={y} className="bg-neutral-7">
              {y}년
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-1"
        />
      </div>

      {/* Month Selector */}
      <div className="relative inline-block">
        <select
          value={month}
          onChange={handleMonthChange}
          className="appearance-none bg-neutral-7 shadow rounded-[8px] pl-3 pr-8 py-2 text-body-01 text-neutral-1 font-medium focus:outline-none cursor-pointer"
        >
          {availableMonths.map((m) => (
            <option key={m} value={m} className="bg-neutral-7">
              {m}월
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-1"
        />
      </div>
    </div>
  );
}
