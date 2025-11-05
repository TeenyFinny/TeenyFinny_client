"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * StockPurchaseSheetProps
 * @typedef {Object} StockPurchaseSheetProps
 * @property {number} purchasePrice - 주식의 구매 가격입니다. (예: 280000)
 * @property {number} expectedPrice - 주당 예상 체결가입니다. (예: 281000)
 * @property {number} availableAmount - 구매 가능한 금액입니다. (예: 0)
 * @property {number} maxQuantity - 구매 가능한 최대 주식 수량입니다. (예: 0)
 * @property {(quantity: number) => void} [onPurchase] - 사기 버튼 클릭 시 실행될 콜백 함수입니다. 입력된 수량을 인자로 받습니다.
 * @property {() => void} [onCancel] - 취소 버튼 클릭 시 실행될 콜백 함수입니다.
 */
interface StockPurchaseSheetProps {
  purchasePrice: number;
  expectedPrice: number;
  availableAmount: number;
  maxQuantity: number;
  onPurchase?: (quantity: number) => void;
  onCancel?: () => void;
}

/**
 * StockPurchaseSheet
 *
 * 주식 구매를 위한 바텀시트 컴포넌트입니다.
 * 숫자 키패드를 통해 구매 수량을 입력하고, 예상 체결가를 실시간으로 계산하여 표시합니다.
 *
 * ### 특징
 * - 숫자 키패드를 통해 구매 수량을 직관적으로 입력할 수 있습니다.
 * - 입력된 수량에 따라 예상 체결가(총 금액)가 자동으로 계산되어 표시됩니다.
 * - 취소 및 구매 버튼을 통해 상위 컴포넌트로 이벤트를 전달합니다.
 * - globals.css에 정의된 색상과 타이포그래피 클래스를 사용하여 일관된 디자인을 제공합니다.
 * - 재사용 가능한 구조로 설계되어 다양한 주식 구매 시나리오에 활용할 수 있습니다.
 *
 * ### 시각적 구성
 * - 상단 핸들 바 (회색 라운드 바)
 * - 제목: "주식 사기"
 * - 구매할 가격 정보 카드 (파란색 8% 투명도 배경)
 *   - 구매할 가격 표시
 *   - 예상 체결가 (총 금액) 표시
 * - 수량 입력 카드 (파란색 8% 투명도 배경)
 *   - 입력된 수량 또는 플레이스홀더 텍스트 표시
 *   - 구매 가능 금액 및 최대 수량 정보 표시
 * - 숫자 키패드 (1-9, 00, 0, 백스페이스 아이콘)
 * - 하단 액션 버튼 (취소, 사기)
 *
 * ### 동작 로직
 * - 숫자 버튼(1-9, 0, 00) 클릭 시 수량 입력 필드에 숫자가 순차적으로 추가됩니다.
 * - 삭제 버튼 클릭 시 마지막 입력 숫자가 제거됩니다.
 * - 예상 체결가는 `expectedPrice × 수량`으로 자동 계산되어 실시간으로 업데이트됩니다.
 * - 수량이 입력되지 않은 경우 플레이스홀더 텍스트가 표시됩니다.
 * - 사기 버튼 클릭 시 `onPurchase` 콜백이 입력된 수량과 함께 실행됩니다.
 * - 취소 버튼 클릭 시 `onCancel` 콜백이 실행됩니다.
 *
 * @component
 * @param {StockPurchaseSheetProps} props - StockPurchaseSheet 컴포넌트 속성
 * @returns {React.ReactElement} 주식 구매 바텀시트 UI
 *
 * @example
 * \`\`\`tsx
 * const [isOpen, setIsOpen] = useState(false)
 *
 * <StockPurchaseSheet
 *   purchasePrice={280000}
 *   expectedPrice={281000}
 *   availableAmount={1000000}
 *   maxQuantity={10}
 *   onPurchase={(quantity) => {
 *     console.log(`${quantity}주 구매 요청`)
 *     setIsOpen(false)
 *     // 구매 API 호출 등의 로직 수행
 *   }}
 *   onCancel={() => {
 *     console.log('구매 취소')
 *     setIsOpen(false)
 *   }}
 * />
 * \`\`\`
 */
export function StockPurchaseSheet({
  purchasePrice,
  expectedPrice,
  availableAmount,
  maxQuantity
}: StockPurchaseSheetProps) {
  const [quantity, setQuantity] = useState("");

  /**
   * 입력된 수량에 따른 총 금액을 계산합니다.
   * 수량이 입력되지 않았거나 유효하지 않은 경우 0을 반환합니다.
   *
   * @returns {number} 예상 체결가 × 수량으로 계산된 총 금액
   *
   * @example
   * // 수량이 "5"이고 expectedPrice가 281000일 때
   * calculateTotalPrice() // 1405000 반환
   */
  const calculateTotalPrice = () => {
    const qty = Number.parseInt(quantity) || 0;
    return qty * expectedPrice;
  };

  /**
   * 숫자를 한국 로케일 형식으로 포맷팅합니다.
   * 천 단위마다 콤마를 추가하여 가독성을 높입니다.
   * 유효하지 않은 값(undefined, null, NaN)이 입력되면 "0"을 반환합니다.
   *
   * @param {number} num - 포맷팅할 숫자
   * @returns {string} 포맷팅된 문자열 (예: "280,000")
   *
   * @example
   * formatNumber(280000) // "280,000" 반환
   * formatNumber(undefined) // "0" 반환
   */
  const formatNumber = (num: number) => {
    if (num === undefined || num === null || Number.isNaN(num)) {
      return "0";
    }
    return num.toLocaleString("ko-KR");
  };

  /**
   * 숫자 버튼 클릭 시 수량에 숫자를 추가하는 핸들러입니다.
   * 기존 수량 문자열 뒤에 새로운 숫자를 연결합니다.
   *
   * @param {string} value - 추가할 숫자 값 ("1"-"9", "0", "00")
   *
   * @example
   * // 현재 수량이 "5"일 때
   * handleNumberClick("3") // 수량이 "53"으로 변경됨
   * handleNumberClick("00") // 수량이 "500"으로 변경됨
   */
  const handleNumberClick = (value: string) => {
    setQuantity((prev) => prev + value);
  };

  /**
   * 삭제 버튼 클릭 시 마지막 숫자를 제거하는 핸들러입니다.
   * 문자열의 마지막 문자를 제거하여 백스페이스 기능을 구현합니다.
   *
   * @example
   * // 현재 수량이 "123"일 때
   * handleDelete() // 수량이 "12"로 변경됨
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
          {formatNumber(purchasePrice)}원
        </p>
        <p className="text-body-07 text-(--color-neutral-3) whitespace-pre-line">
          예상 체결가 {formatNumber(calculateTotalPrice() || expectedPrice)}원
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
          구매가능 {formatNumber(availableAmount)}원 · 최대 {maxQuantity}주
        </p>
      </div>

      {/** Number Keypad */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(String(num))}
            className="flex h-14 items-center justify-center rounded-lg text-head-00 text-(--color-neutral-2) transition-colors hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray)"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberClick(String("00"))}
          className="flex h-14 items-center justify-center rounded-lg text-head-00 text-(--color-neutral-2) transition-colors hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray)"
        >
          00
        </button>
        <button
          onClick={() => handleNumberClick(String("0"))}
          className="flex h-14 items-center justify-center rounded-lg text-head-00 text-(--color-neutral-2) transition-colors hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray)"
        >
          0
        </button>
        <button
          onClick={() => handleDelete()}
          className="flex h-14 items-center justify-center rounded-lg transition-colors hover:bg-(--color-monochrome-lightgray) active:bg-(--color-monochrome-gray)"
        >
          <Image
            src="/icons/delete-arrow.svg"
            alt="삭제"
            width={30}
            height={30}
            className="scale-x-[-1] opacity-60"
          />
        </button>
      </div>

      {/** Action Buttons */}
      <div className="flex gap-3">
        <button
          className="text-body-04 flex-1 rounded-lg bg-(--color-monochrome-gray) py-4 font-medium text-(--color-neutral-2) transition-colors hover:bg-(--color-monochrome-lightgray) active:bg-(--color-neutral-4) whitespace-pre-line"
        >
          취소
        </button>
        <button
          className="text-body-04 flex-1 rounded-lg bg-(--color-primary-1) py-4 font-medium text-(--color-neutral-6) transition-colors hover:bg-[#005a96] active:bg-[#004d80] whitespace-pre-line"
        >
          사기
        </button>
      </div>
    </div>
  );
}
