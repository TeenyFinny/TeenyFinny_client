"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface StockPurchaseBottomSheet {
  open: boolean;
  setOpen: (open: boolean) => void;
  price: number;
  availableStocks: number;
  maxQuantity: number;
  onConfirm: (quantity: number) => void;
  onCancel?: () => void;
}

export function StockPurchaseBottomSheet({
  open,
  setOpen,
  price,
  availableStocks,
  maxQuantity,
  onConfirm,
  onCancel,
}: StockPurchaseBottomSheet) {
  const [quantity, setQuantity] = useState<string>("");
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragCurrentY, setDragCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      setQuantity("");
      setDragStartY(0);
      setDragCurrentY(0);
      setIsDragging(false);
    }
  }, [open]);

  if (!open) return null;

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

  const handleNumberClick = (value: string) => {
    const newQuantity = quantity + value;
    const numericValue = Number.parseInt(newQuantity);
    setQuantity(numericValue > maxQuantity ? maxQuantity.toString() : newQuantity);
  };

  const handleBackspace = () => setQuantity(quantity.slice(0, -1));
  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };
  const handleConfirm = () => {
    const qty = Number.parseInt(quantity) || 0;
    if (qty > 0) onConfirm(qty);
  };

  const expectedPrice = (Number.parseInt(quantity) || 0) * price;
  const formatNumber = (num: number) =>
    num && !Number.isNaN(num) ? num.toLocaleString("ko-KR") : "0";

  const sheetStyle = isDragging
    ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" }
    : {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-(--color-neutral-1)/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-[480px] h-[85vh] rounded-t-[24px] bg-(--color-neutral-6) pb-6 shadow-lg transition-transform duration-300 overflow-hidden"
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 핸들바 */}
        <div className="flex justify-center pt-3 pb-5">
          <div className="h-[5px] w-[60px] rounded-full bg-(--color-neutral-4)" />
        </div>

        {/* 제목 */}
        <h2 className="text-head-03 text-(--color-neutral-1) text-center mb-5">
          주식 사기
        </h2>

        {/* 구매할 가격 카드 */}
        <div className="mx-5 mb-3 rounded-[16px] bg-(--color-primary-1)/[0.08] px-4 py-[14px] text-left">
          <p className="text-body-07 text-(--color-neutral-1) mb-2">구매할 가격</p>
          <p className="text-head-01 text-(--color-neutral-1) mb-1">
            {formatNumber(price)}원
          </p>
          <p className="text-body-08 text-(--color-neutral-3)">
            예상 체결가 {formatNumber(expectedPrice)}원
          </p>
        </div>

        {/* 수량 입력 카드 */}
        <div className="mx-5 mb-6 rounded-[16px] bg-(--color-primary-1)/[0.08] px-4 py-[14px] text-left">
          <p className="text-body-07 text-(--color-neutral-1) mb-2">수량</p>
          <p
            className={`text-head-01 mb-1 ${
              quantity ? "text-(--color-neutral-1)" : "text-(--color-neutral-4)"
            }`}
          >
            {quantity || "몇 주 구매할까요?"}
          </p>
          <p className="text-body-08 text-(--color-neutral-3)">
            구매가능 {formatNumber(availableStocks)}원 · 최대 {maxQuantity}주
          </p>
        </div>

        {/* 숫자 키패드 */}
        <div className="mx-5 mb-5 grid grid-cols-3 gap-x-4 gap-y-[12px] py-[7px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-[40px] text-head-00 text-(--color-neutral-2) rounded-[12px] hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray) transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberClick("00")}
            className="h-[40px] text-head-00 text-(--color-neutral-2) rounded-[12px] hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray) transition-colors"
          >
            00
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            className="h-[40px] text-head-00 text-(--color-neutral-2) rounded-[12px] hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray) transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-[40px] flex items-center justify-center rounded-[12px] text-(--color-neutral-2) hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray)"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="mx-5 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 h-[56px] rounded-[16px] bg-(--color-monochrome-gray) text-body-04 text-(--color-neutral-1) hover:bg-(--color-monochrome-lightgray) active:bg-(--color-neutral-5)"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!quantity || Number.parseInt(quantity) === 0}
            className="flex-1 h-[56px] rounded-[16px] bg-(--color-primary-1) text-body-04 text-(--color-neutral-6) hover:bg-[#005a96] active:bg-[#004d80] disabled:opacity-50"
          >
            사기
          </button>
        </div>
      </div>
    </div>
  );
}
