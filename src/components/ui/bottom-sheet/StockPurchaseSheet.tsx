"use client";
import Image from "next/image";
import { useState } from "react";

/**
 * StockPurchaseSheet
 *
 * 주식 구매를 위한 바텀시트 UI 컴포넌트입니다.
 *
 * ### 특징
 * - 정적 UI만 제공하며, 이벤트 핸들러나 상태 관리는 포함하지 않습니다.
 * - globals.css에 정의된 색상과 타이포그래피 클래스를 사용합니다.
 * - 디자인 이미지와 동일한 레이아웃과 스타일을 구현합니다.
 *
 * ### 시각적 구성
 * - 상단 핸들 바 (회색 라운드 바)
 * - 제목: "주식 사기"
 * - 구매할 가격 정보 카드 (라이트 그레이 배경)
 * - 수량 입력 카드 (라이트 그레이 배경, 플레이스홀더 텍스트)
 * - 숫자 키패드 (1-9, 00, 0, 백스페이스 아이콘)
 * - 하단 액션 버튼 (취소, 사기)
 *
 * @component
 * @returns {React.ReactElement} 주식 구매 바텀시트 UI
 *
 * @example
 * ```tsx
 * <StockPurchaseSheet />
 * ```
 */
export function StockPurchaseSheet() {
  const [quantity, setQuantity] = useState(""); // 주식 구매 수량

  const pricePerShare = 281000; // 예상 체결가
  const calculateTotalPrice = () => {
    // 주식 구매 수량에 따른 총 금액 계산
    const qty = Number.parseInt(quantity) || 0;
    return qty * pricePerShare;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("ko-KR");
  };

  /**
   * 숫자 버튼 클릭 시 수량에 숫자를 추가하는 핸들러
   * @param {string} value - 추가할 숫자 값 ("1"-"9", "0", "00")
   */
  const handleNumberClick = (value: String) => {
    setQuantity((prev) => prev + value);
  };
  /**
   * 삭제 버튼 클릭 시 마지막 숫자를 제거하는 핸들러
   */
  const handleDelete = () => {
    setQuantity((prev) => prev.slice(0, -1));
  };
  return (
    <div className="w-full max-w-[768px] rounded-t-[20px] bg-(--color-neutral-6) px-6 pb-8 pt-3">
      {/** Handle bar */}
      <div className="mb-8 flex justify-center">
        <div className="h-1 w-12 rounded-full bg-(--color-neutral-4)" />
      </div>

      {/** Title */}
      <h1 className="text-head-03 mb-6 text-center text-(--color-neutral-1) whitespace-pre-line">
        주식 사기
      </h1>

      {/** Purchase Price Card */}
      <div className="mb-4 rounded-[16px] bg-(--color-primary-1)/[0.08] px-6 py-5">
        <p className="text-body-02 mb-2 text-(--color-neutral-1) whitespace-pre-line">
          구매할 가격
        </p>
        <p className="text-head-01 mb-1 text-(--color-neutral-1) whitespace-pre-line">
          280,000원
        </p>
        <p className="text-body-07 text-(--color-neutral-3) whitespace-pre-line">
          예상 체결가 {formatNumber(calculateTotalPrice() || pricePerShare)}원
        </p>
      </div>

      {/** Quantity Input Card */}
      <div className="mb-6 rounded-[16px] bg-(--color-primary-1)/[0.08] px-6 py-5">
        <p className="text-body-02 mb-2 text-(--color-neutral-1) whitespace-pre-line">
          수량
        </p>
        <p
          className={`text-head-01 mb-1 whitespace-pre-line ${
            quantity ? "text-(--color-neutral-1)" : "text-(--color-neutral-4)"
          }`}
        >
          {quantity || "몇 주 구매할까요?"}
        </p>
        <p className="text-body-07 text-(--color-neutral-3) whitespace-pre-line">
          구매가능 0원 · 최대 0주
        </p>
      </div>

      {/** Number Keypad */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className="flex h-14 items-center justify-center rounded-lg text-head-00 text-(--color-neutral-2) transition-colors hover:bg-[#f6f7f8] active:bg-[#e8ebee]"
            onClick={() => handleNumberClick(String(num))}
          >
            {num}
          </button>
        ))}
        <button
          className="flex h-14 items-center justify-center rounded-lg text-head-00 text-(--color-neutral-2) transition-colors hover:bg-[#f6f7f8] active:bg-[#e8ebee]"
          onClick={() => handleNumberClick(String("00"))}
        >
          00
        </button>
        <button
          className="flex h-14 items-center justify-center rounded-lg text-head-00 text-(--color-neutral-2) transition-colors hover:bg-[#f6f7f8] active:bg-[#e8ebee]"
          onClick={() => handleNumberClick(String("0"))}
        >
          0
        </button>
        <button className="flex h-14 items-center justify-center rounded-lg transition-colors hover:bg-[#f6f7f8] active:bg-[#e8ebee]"
        onClick = { () => handleDelete()}>
          <Image
            src="/icons/delete_arrow.svg"
            alt="삭제"
            width={30}
            height={30}
            className="scale-x-[-1] opacity-60"
          />
        </button>
      </div>

      {/** Action Buttons */}
      <div className="flex gap-3">
        <button className="text-body-04 flex-1 rounded-lg bg-[#e8ebee] py-4 font-medium text-(--color-neutral-2) transition-colors hover:bg-[#f6f7f8] active:bg-(--color-neutral-4) whitespace-pre-line">
          취소
        </button>
        <button className="text-body-04 flex-1 rounded-lg bg-(--color-primary-1) py-4 font-medium text-(--color-neutral-6) transition-colors hover:bg-[#005a96] active:bg-[#004d80] whitespace-pre-line">
          사기
        </button>
      </div>
    </div>
  );
}
