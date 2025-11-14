"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

/**
 * @typedef DetailData
 * @description 거래 상세 정보를 표현하는 타입
 * @property {string} merchant - 사용처(가맹점명)
 * @property {number} amount - 거래 금액(양수)
 * @property {string} date - 거래일(YYYY-MM-DD HH:MM:SS)
 * @property {string} type - 거래 구분(예: 일시불, 할부 등)
 * @property {string} category - 카테고리
 * @property {number} approveAmount - 승인된 실제 금액
 * @property {number} balanceAfter - 거래 후 잔액
 */
interface DetailData {
  merchant: string;
  amount: number;
  date: string;
  type: string;
  category: string;
  approveAmount: number;
  balanceAfter: number;
}

interface BottomSheetDetailProps {
  /**
   * 바텀시트 열림 여부
   */
  open: boolean;

  /**
   * 열림/닫힘 상태를 변경하는 setter
   */
  setOpen: (open: boolean) => void;

  /**
   * 바텀시트 타이틀(기본값: "상세 이용내역")
   */
  title?: string;

  /**
   * true면 하단 네비게이션바 위로 오버레이됨 (z-index 조정)
   */
  shouldOverlayBottomBar?: boolean;

  /**
   * 상세 데이터 객체 (API 또는 상위 컴포넌트에서 전달)
   */
  detail: DetailData;
}

/**
 * @component BottomSheetDetail
 * @description
 * 결제 상세 이용내역을 표시하는 **바텀시트 컴포넌트**  
 * 드래그로 내리기, 백드롭 클릭 닫기, 스크롤 잠금 기능을 지원함.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <BottomSheetDetail
 *   open={open}
 *   setOpen={setOpen}
 *   shouldOverlayBottomBar={true}
 *   detail={{
 *     merchant: "스타벅스 강남점",
 *     amount: 5900,
 *     date: "2025.01.12 14:23:43",
 *     type: "일시불",
 *     category: "식비",
 *     approveAmount: 5900,
 *     balanceAfter: 104300,
 *   }}
 * />
 * ```
 */
export default function BottomSheetDetail({
  open,
  setOpen,
  title = "상세 이용내역",
  shouldOverlayBottomBar = false,
  detail,
}: BottomSheetDetailProps) {
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * 바텀시트가 열리면 body 스크롤 잠금
   */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
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

  const zIndexClass = shouldOverlayBottomBar ? "z-[60]" : "z-50";

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex justify-center items-end bg-neutral-1/50 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-[375px] h-auto relative rounded-t-[24px] bg-neutral-7 pb-[32px] shadow-lg transition-transform duration-300 overflow-y-auto ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 핸들바 */}
        <div className="flex justify-center pt-[12px] pb-[18px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4/50" />
        </div>

        {/* 제목 */}
        <p className="text-head-04 font-bold text-neutral-1 ml-[24px]">{title}</p>

        {/* 닫기 버튼 */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-[36px] right-[24px] text-neutral-2 hover:text-neutral-1"
          aria-label="닫기"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* 사용처 + 금액 */}
        <div className="mt-[26px] px-6 flex flex-col">
          <span className="text-head-01 font-bold text-neutral-2">{detail.merchant}</span>
          <span className="text-landing-01 font-bold text-neutral-1">
            {detail.amount.toLocaleString()}원
          </span>
        </div>

        {/* 상세 정보 리스트 */}
        <div className="mt-[26px] px-[26px] flex flex-col gap-[23px]">
          <InfoRow label="거래일" value={detail.date} />
          <InfoRow label="거래구분" value={detail.type} />
          <InfoRow label="카테고리" value={detail.category} />
          <InfoRow label="거래금액" value={`${detail.amount.toLocaleString()}원`} />
          <InfoRow label="결제금액" value={`${detail.approveAmount.toLocaleString()}원`} />
          <InfoRow label="결제 후 잔액" value={`${detail.balanceAfter.toLocaleString()}원`} />
        </div>
      </div>
    </div>
  );
}

/**
 * @component InfoRow
 * @description 좌측 라벨 / 우측 데이터로 구성된 단일 정보 행
 * @param {{
 *  label: string,
 *  value: string
 * }} props
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-body-04 font-medium text-neutral-1">{label}</span>
      <span className="text-body-04 font-medium text-neutral-1">{value}</span>
    </div>
  );
}
