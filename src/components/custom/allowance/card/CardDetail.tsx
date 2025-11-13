"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface CardDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

/**
 * CardDetail
 *
 * 카드 이름, 번호, 유효기간, CVC 정보를 표시하는 바텀시트 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 카드 상세 정보를 하단 시트로 표시
 * - 배경 클릭, X 버튼, 아래로 스와이프 시 닫기 가능
 * - 열릴 때 스크롤 방지
 *
 * @component
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 * <CardDetail
 *   open={open}
 *   setOpen={setOpen}
 *   cardName="첼"
 *   cardNumber="1111 2222 3333 4444"
 *   expiry="02/26"
 *   cvc="123"
 * />
 * ```
 */
export function CardDetail({
  open,
  setOpen,
  cardName,
  cardNumber,
  expiry,
  cvc,
}: CardDetailProps) {
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - dragStartY;
    if (diff > 0) setDragCurrentY(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragCurrentY > 100) setOpen(false);
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  const sheetStyle = isDragging
    ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" }
    : {};

  return (
    <div
      className={`fixed inset-0 z-60 flex justify-center items-end bg-black/40 transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-[375px] h-[355px] relative rounded-t-[24px] bg-neutral-7 shadow-lg transition-transform duration-300 overflow-hidden ${
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
          <Image
            src="/icons/x.png"
            alt="수정"
            width={27}
            height={27}
            unoptimized
          />
        </button>

        <div className="px-[24px] space-y-[22px]">
          <div>
            <div className="flex items-center gap-[4px] mt-[46px]">
              <p className="text-body-04 text-neutral-3">카드 이름</p>
              <Image
                src="/icons/edit-small.png"
                alt="수정"
                width={18}
                height={17}
                unoptimized
              />
            </div>
            <p className="text-head-08 text-neutral-1 mt-[17px]">{cardName}</p>
            {/* 아래 선 */}
            <div className="mt-[12px] border-b border-monochrome-gray " />
          </div>

          <div>
            <p className="text-body-04 text-neutral-3 mb-[17px]">카드 번호</p>
            <p className="text-head-08 text-neutral-1">{cardNumber}</p>
            {/* 아래 선 */}
            <div className="mt-[12px] border-b border-monochrome-gray" />
          </div>

          <div className="flex gap-[40px]">
            <div>
              <p className="text-body-04 text-neutral-3 mb-[17px]">유효기간</p>
              <p className="text-head-08 text-neutral-1">{expiry}</p>
              {/* 아래 선 */}
              <div className="mt-[12px] border-b border-monochrome-gray w-[140px]" />
            </div>
            <div>
              <p className="text-body-04 text-neutral-3 mb-[17px]">CVC</p>
              <p className="text-head-08 text-neutral-1">{cvc}</p>
              {/* 아래 선 */}
              <div className="mt-[12px] border-b border-monochrome-gray w-[140px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
