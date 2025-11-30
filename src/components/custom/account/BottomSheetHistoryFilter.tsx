"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SmallButtonActivated } from "@/components/ui/button/SmallButtonActivated";
import { SmallButtonDisabled } from "@/components/ui/button/SmallButtonDisabled";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";

interface BottomSheetHistoryFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRange: string;
  customStartDate: string | null;
  customEndDate: string | null;
  onSelectRange: (range: string) => void;
  onSelectCustom: (startDate: string, endDate: string) => void;
}

export function BottomSheetHistoryFilter({
  open,
  setOpen,
  selectedRange,
  customStartDate,
  customEndDate,
  onSelectRange,
  onSelectCustom,
}: BottomSheetHistoryFilterProps) {
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // Custom date states
  const currentDate = new Date();
  const [startYear, setStartYear] = useState(currentDate.getFullYear());
  const [startMonth, setStartMonth] = useState(currentDate.getMonth() + 1);
  const [endYear, setEndYear] = useState(currentDate.getFullYear());
  const [endMonth, setEndMonth] = useState(currentDate.getMonth() + 1);

  /**
   * 바텀시트가 열리면 body 스크롤 잠금
   */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setShowCustom(false);
    } else {
      document.body.style.overflow = "";
      setDragStartY(0);
      setDragCurrentY(0);
      setIsDragging(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /** 백드롭 클릭 시 닫기 */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  /** 드래그 시작 지점 저장 */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  /** 드래그 중: 아래로 이동한 거리만큼 translateY 적용 */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - dragStartY;
    if (diff > 0) setDragCurrentY(diff);
  };

  /** 드래그 종료 시: 일정 이상 끌어내리면 닫기 */
  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragCurrentY > 100) setOpen(false);
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  /** 터치 중 translate 스타일 */
  const sheetStyle = isDragging
    ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" }
    : {};

  const presetOptions = [
    { label: "이번 달", value: "1m" },
    { label: "3개월", value: "3m" },
    { label: "6개월", value: "6m" },
    { label: "1년", value: "1y" },
  ];

  // Generate years (current year and past 5 years)
  const years = Array.from({ length: 6 }, (_, i) => currentDate.getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Get last day of month
  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleApplyCustom = () => {
    const startDate = `${startYear}-${String(startMonth).padStart(2, "0")}-01`;
    const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-${String(
      getLastDayOfMonth(endYear, endMonth)
    ).padStart(2, "0")}`;
    onSelectCustom(startDate, endDate);
    setOpen(false);
  };

  // Format date for display (YYYY.MM.DD)
  const formatDisplayDate = (dateStr: string) => {
    return dateStr.replace(/-/g, ".");
  };

  // Calculate display dates based on current selection
  const getDisplayDates = () => {
    if (customStartDate && customEndDate) {
      return {
        start: formatDisplayDate(customStartDate),
        end: formatDisplayDate(customEndDate),
      };
    }

    const end = new Date();
    const start = new Date();

    switch (selectedRange) {
      case "1m":
        start.setDate(1);
        break;
      case "3m":
        start.setMonth(start.getMonth() - 3);
        break;
      case "6m":
        start.setMonth(start.getMonth() - 6);
        break;
      case "1y":
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 3);
    }

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}.${m}.${d}`;
    };

    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  };

  const displayDates = getDisplayDates();

  // Calculate available end months based on start date (max 6 months)
  const getAvailableEndMonths = () => {
    const startTotalMonths = startYear * 12 + startMonth;
    const maxEndTotalMonths = startTotalMonths + 6;
    
    const availableMonths: number[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const totalMonths = endYear * 12 + month;
      if (totalMonths >= startTotalMonths && totalMonths <= maxEndTotalMonths) {
        availableMonths.push(month);
      }
    }
    
    return availableMonths;
  };

  // Calculate available end years based on start date
  const getAvailableEndYears = () => {
    const maxYear = startYear + 1; // Maximum 1 year ahead for 6 month range
    const availableYears: number[] = [];
    
    for (const year of years) {
      if (year >= startYear && year <= maxYear) {
        availableYears.push(year);
      }
    }
    
    return availableYears;
  };

  // Auto-adjust end date if it exceeds 6 months from start date
  useEffect(() => {
    if (showCustom) {
      const startTotalMonths = startYear * 12 + startMonth;
      const endTotalMonths = endYear * 12 + endMonth;
      const maxEndTotalMonths = startTotalMonths + 6;
      
      if (endTotalMonths > maxEndTotalMonths) {
        const newEndYear = Math.floor(maxEndTotalMonths / 12);
        const newEndMonth = maxEndTotalMonths % 12 || 12;
        setEndYear(newEndYear);
        setEndMonth(newEndMonth);
      }
      
      if (endTotalMonths < startTotalMonths) {
        setEndYear(startYear);
        setEndMonth(startMonth);
      }
    }
  }, [startYear, startMonth, endYear, endMonth, showCustom]);

  const availableEndYears = getAvailableEndYears();
  const availableEndMonths = getAvailableEndMonths();

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end bg-neutral-1/50 transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-[375px] h-[60vh] relative rounded-t-[24px] bg-neutral-7 pb-[32px] shadow-lg transition-all duration-300 overflow-hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 핸들바 - 드래그하여 바텀시트를 닫을 수 있는 상단 바 */}
        <div className="flex justify-center pt-[12px] pb-[20px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4/50" />
        </div>

        {/* X 닫기 버튼 - 상단 40px, 오른쪽 30px */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-[40px] right-[30px] text-neutral-2 hover:text-neutral-1"
          aria-label="닫기"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* 제목 */}
        <h2 className="text-head-01 text-left text-neutral-1 px-[24px] mb-[32px]">
          조회기간 선택
        </h2>

        {/* 내용 영역 - 스크롤 가능 */}
        <div className="overflow-y-auto h-[calc(60vh-200px)] px-[24px]">
          {/* 부제목 */}
          <p className="text-head-04 text-neutral-1 mb-[12px]">조회기간</p>

          {/* 가로 한 줄 옵션 - 동일한 너비 */}
          <div className="mb-[16px]">
            <div className="flex gap-2">
              {presetOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSelectRange(option.value);
                    setShowCustom(false);
                  }}
                  className={`flex-1 px-2 py-2 text-body-04 transition-all ${
                    selectedRange === option.value && !showCustom
                      ? "text-neutral-1 font-bold"
                      : "text-neutral-2"
                  }`}
                >
                  {option.label}
                </button>
              ))}
              
              {/* 직접 입력 버튼 */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className={`flex-1 px-2 py-2 text-body-04 transition-all ${
                  showCustom
                    ? "text-neutral-1 font-bold"
                    : "text-neutral-2"
                }`}
              >
                직접<br/>입력
              </button>
            </div>
          </div>

          {/* 기간 표시 박스 */}
          <div className="mb-[16px] min-h-[100px]">
            {showCustom ? (
              /* 직접 입력 시: 드롭다운으로 편집 가능 */
              <div>
                <div className="border border-neutral-4 rounded-[12px] p-[16px] mb-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* 시작일 */}
                    <div className="flex items-center gap-1">
                      <select
                        value={startYear}
                        onChange={(e) => setStartYear(Number(e.target.value))}
                        className="px-2 py-1 border-0 bg-transparent text-body-02 text-neutral-1 cursor-pointer focus:outline-none"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <select
                        value={startMonth}
                        onChange={(e) => setStartMonth(Number(e.target.value))}
                        className="px-2 py-1 border-0 bg-transparent text-body-02 text-neutral-1 cursor-pointer focus:outline-none"
                      >
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {String(month).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 구분자 */}
                    <span className="text-head-01 text-neutral-3">~</span>

                    {/* 종료일 */}
                    <div className="flex items-center gap-1">
                      <select
                        value={endYear}
                        onChange={(e) => setEndYear(Number(e.target.value))}
                        className="px-2 py-1 border-0 bg-transparent text-body-02 text-neutral-1 cursor-pointer focus:outline-none"
                      >
                        {availableEndYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <select
                        value={endMonth}
                        onChange={(e) => setEndMonth(Number(e.target.value))}
                        className="px-2 py-1 border-0 bg-transparent text-body-02 text-neutral-1 cursor-pointer focus:outline-none"
                      >
                        {availableEndMonths.map((month) => (
                          <option key={month} value={month}>
                            {String(month).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <p className="text-body-07 text-neutral-3 mb-3">* 최대 6개월까지 조회 가능합니다</p>
              </div>
            ) : (
              /* 기본 옵션 선택 시: 계산된 기간을 텍스트로만 표시 */
              <div className="border border-neutral-4 rounded-[12px] p-[16px]">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-body-02 text-neutral-1">{displayDates.start}</span>
                  <span className="text-head-01 text-neutral-3">~</span>
                  <span className="text-body-02 text-neutral-1">{displayDates.end}</span>
                </div>
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          {showCustom ? (
            /* 적용/취소 버튼 */
            <div className="flex gap-2 justify-center">
              <SmallButtonDisabled
                label="취소"
                onClick={() => setShowCustom(false)}
              />
              <SmallButtonActivated
                label="적용"
                onClick={handleApplyCustom}
              />
            </div>
          ) : (
            /* 적용 버튼 */
            <div className="flex justify-center">
              <BigButtonActivated
                label="적용"
                onClick={() => setOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

