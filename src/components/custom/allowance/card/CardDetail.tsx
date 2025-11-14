"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * CardDetailProps
 * @typedef {Object} CardDetailProps
 * @property {boolean} open - 바텀시트 열림 여부
 * @property {(open: boolean) => void} setOpen - 바텀시트 상태 변경 함수
 * @property {string} cardName - 카드 이름
 * @property {string} cardNumber - 카드 번호
 * @property {string} expiry - 유효기간
 * @property {string} cvc - CVC 코드
 */
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
 * 카드 이름, 번호, 유효기간, CVC 정보를 표시하는 **바텀시트 컴포넌트**입니다.
 *
 * ### 주요 기능
 * - 카드 상세 정보(이름, 번호, 유효기간, CVC) 표시
 * - 카드 이름 수정 가능 (`edit` 아이콘 클릭 시 input 활성화)
 * - 배경 클릭, X 버튼, 아래로 스와이프 시 닫기
 * - 바텀시트 열릴 때 스크롤 방지 처리
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
  cardName: initialCardName,
  cardNumber,
  expiry,
  cvc,
}: CardDetailProps) {
  // 드래그 상태 관리
  const [dragStartY, setDragStartY] = useState(0); // 드래그 시작 위치
  const [dragCurrentY, setDragCurrentY] = useState(0); // 현재 드래그 이동 거리
  const [isDragging, setIsDragging] = useState(false); // 드래그 중 여부

  // 카드 이름 수정 상태 관리
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [cardName, setCardName] = useState(initialCardName); // 수정 가능한 카드 이름 값

  /** 바텀시트 열림 상태에 따라 body 스크롤 방지 */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /** 배경 클릭 시 바텀시트 닫기 */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  /** 터치 시작 이벤트 - 드래그 시작 Y 좌표 저장 */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  /** 터치 이동 이벤트 - 아래로만 드래그 가능 */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - dragStartY;
    if (diff > 0) setDragCurrentY(diff);
  };

  /** 터치 종료 이벤트 - 일정 거리 이상 드래그 시 닫기 */
  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragCurrentY > 100) setOpen(false);
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  /** 수정 아이콘 클릭 → 수정 모드 진입 */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /** 수정 완료 처리 (Enter 또는 blur 시) */
  const handleEditComplete = () => {
    if (cardName.trim() === "") return;
    setIsEditing(false);
  };

  /** 드래그 시 바텀시트 이동 스타일 적용 */
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
        {/* 상단 핸들바 (바텀시트 닫기용 드래그 바) */}
        <div className="flex justify-center pt-[12px] pb-[20px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4/50" />
        </div>

        {/* 닫기 버튼 (X 아이콘) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-[40px] right-[30px] text-neutral-2 hover:text-neutral-1"
          aria-label="닫기"
        >
          <Image src="/icons/x.png" alt="닫기" width={27} height={27} unoptimized />
        </button>

        {/* 카드 상세 정보 영역 */}
        <div className="px-[24px] space-y-[22px]">
          {/* 카드 이름 */}
          <div>
            {/* 카드 이름 라벨 + 수정 버튼 */}
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

            {/* 수정 모드 */}
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onBlur={handleEditComplete}
                  onKeyDown={(e) => e.key === "Enter" && handleEditComplete()}
                  className="mt-[17px] text-head-08 text-neutral-1 bg-transparent outline-none w-full"
                  autoFocus
                />
                {/* 기존 밑줄에 포커스 효과 추가 */}
                <div
                  className={`mt-[12px] border-b transition-colors duration-200 ${
                    isEditing ? "border-primary-1" : "border-monochrome-gray"
                  }`}
                />
              </>
            ) : (
              <>
                <p className="text-head-08 text-neutral-1 mt-[17px]">{cardName}</p>
                <div className="mt-[12px] border-b border-monochrome-gray" />
              </>
            )}
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
