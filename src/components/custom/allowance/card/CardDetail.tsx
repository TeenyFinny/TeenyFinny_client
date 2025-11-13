"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
 * 카드 이름 수정 기능 추가 버전
 */
export function CardDetail({
  open,
  setOpen,
  cardName: initialCardName,
  cardNumber,
  expiry,
  cvc,
}: CardDetailProps) {
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [cardName, setCardName] = useState(initialCardName);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    if (cardName.trim() === "") return;
    setIsEditing(false);
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
        {/* 핸들바 */}
        <div className="flex justify-center pt-[12px] pb-[20px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4/50" />
        </div>

        {/* X 닫기 버튼 */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-[40px] right-[30px] text-neutral-2 hover:text-neutral-1"
          aria-label="닫기"
        >
          <Image src="/icons/x.png" alt="닫기" width={27} height={27} unoptimized />
        </button>

        <div className="px-[24px] space-y-[22px]">
          {/* 카드 이름 */}
          <div>
            <div className="flex items-center gap-[4px] mt-[46px]">
              <p className="text-body-04 text-neutral-3">카드 이름</p>
              <button onClick={handleEditClick} aria-label="수정">
                <Image
                  src="/icons/edit-small.png"
                  alt="수정"
                  width={18}
                  height={17}
                  unoptimized
                />
              </button>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                onBlur={handleEditComplete}
                onKeyDown={(e) => e.key === "Enter" && handleEditComplete()}
                className="mt-[17px] text-head-08 text-neutral-1 bg-transparent border-b border-primary-1 outline-none w-full"
                autoFocus
              />
            ) : (
              <p className="text-head-08 text-neutral-1 mt-[17px]">{cardName}</p>
            )}

            <div className="mt-[12px] border-b border-monochrome-gray" />
          </div>

          {/* 카드 번호 */}
          <div>
            <p className="text-body-04 text-neutral-3 mb-[17px]">카드 번호</p>
            <p className="text-head-08 text-neutral-1">{cardNumber}</p>
            <div className="mt-[12px] border-b border-monochrome-gray" />
          </div>

          {/* 유효기간 / CVC */}
          <div className="flex gap-[40px]">
            <div>
              <p className="text-body-04 text-neutral-3 mb-[17px]">유효기간</p>
              <p className="text-head-08 text-neutral-1">{expiry}</p>
              <div className="mt-[12px] border-b border-monochrome-gray w-[140px]" />
            </div>
            <div>
              <p className="text-body-04 text-neutral-3 mb-[17px]">CVC</p>
              <p className="text-head-08 text-neutral-1">{cvc}</p>
              <div className="mt-[12px] border-b border-monochrome-gray w-[140px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
