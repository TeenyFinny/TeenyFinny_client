"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * BottomSheetPassword
 *
 * 간편 비밀번호 입력용 바텀시트 컴포넌트입니다.
 * 6자리 입력을 지원하며, 스와이프 및 배경 클릭으로 닫을 수 있습니다.
 *
 * @param open - 바텀시트 열림 여부
 * @param setOpen - 열림 상태를 제어하는 함수
 * @param onComplete - 6자리 비밀번호 입력 완료 시 실행되는 콜백
 */
export function BottomSheetPassword({
  open,
  setOpen,
  onComplete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onComplete: (pin: string) => void;
}) {
  const [pin, setPin] = useState("");
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /** 바텀시트 닫힐 때 드래그 상태 초기화 */
  useEffect(() => {
    if (!open) {
      setDragStartY(0);
      setDragCurrentY(0);
      setIsDragging(false);
    }
  }, [open]);

  if (!open) return null;

  /** 배경 클릭 시 닫기 */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  /** 터치 이벤트 - 드래그 시작 */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  /** 터치 이동 시 아래로 스와이프만 감지 */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - dragStartY;
    if (diff > 0) setDragCurrentY(diff);
  };

  /** 터치 종료 시 100px 이상 이동하면 닫기 */
  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragCurrentY > 100) setOpen(false);
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  /** 숫자 입력 처리 */
  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        setTimeout(() => onComplete(newPin), 300); // 6자리 입력 완료 시 콜백 실행
      }
    }
  };

  /** 마지막 숫자 삭제 */
  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  /** 전체 삭제 */
  const handleReset = () => {
    setPin("");
  };

  /** 드래그 시 시트가 자연스럽게 이동하는 스타일 */
  const sheetStyle = isDragging
    ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" }
    : {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-(--color-neutral-1)/50"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-[480px] h-[60vh] rounded-t-[24px] bg-(--color-neutral-6) pb-6 shadow-lg transition-transform duration-300 overflow-hidden"
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
        <h2 className="text-head-03 text-center text-(--color-neutral-1) mb-8 font-semibold">
          간편 비밀번호
        </h2>

        {/* 비밀번호 입력 점 */}
        <div className="flex justify-center gap-5 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border border-(--color-neutral-4) ${
                pin.length > i ? "bg-(--color-neutral-3)" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* 숫자 키패드 */}
        <div className="mx-auto w-[240px] grid grid-cols-3 gap-y-7 text-center select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="text-head-02 text-(--color-neutral-2) hover:opacity-70 transition-opacity"
            >
              {num}
            </button>
          ))}

          {/* 전체 삭제 */}
          <button
            onClick={handleReset}
            className="text-body-05 text-(--color-neutral-4)"
          >
            전체삭제
          </button>

          {/* 0 */}
          <button
            onClick={() => handleNumberClick("0")}
            className="text-head-02 text-(--color-neutral-2)"
          >
            0
          </button>

          {/* ← 삭제 */}
          <button
            onClick={handleDelete}
            className="flex justify-center items-center"
          >
            <ArrowLeft className="w-6 h-6 text-(--color-neutral-3)" />
          </button>
        </div>
      </div>
    </div>
  );
}
