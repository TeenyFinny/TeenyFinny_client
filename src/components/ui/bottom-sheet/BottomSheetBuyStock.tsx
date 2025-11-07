"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

/**
 * BottomSheetBuyStock
 * @typedef {Object} BottomSheetBuyStock
 * @property {boolean} open - 바텀시트의 열림 여부를 제어합니다. `true`일 때 바텀시트가 표시됩니다.
 * @property {(open: boolean) => void} setOpen - 바텀시트의 열림 상태를 변경하는 setter 함수입니다.
 * @property {number} price - 주식의 1주당 구매 가격입니다.
 * @property {number} availableStocks - 사용자가 구매 가능한 금액(원)입니다.
 * @property {number} maxQuantity - 구매 가능한 최대 주식 수량입니다.
 * @property {(quantity: number) => void} onConfirm - 사기 버튼 클릭 시 선택한 수량을 전달하는 콜백 함수입니다.
 * @property {() => void} [onCancel] - 취소 버튼 클릭 시 실행될 콜백 함수입니다. (선택사항)
 */
interface BottomSheetBuyStock {
  open: boolean
  setOpen: (open: boolean) => void
  price: number
  availableStocks: number
  maxQuantity: number
  onConfirm: (quantity: number) => void
  onCancel?: () => void
}

/**
 * BottomSheetBuyStock
 *
 * 주식 구매를 위한 수량 입력 바텀시트 컴포넌트입니다.
 *
 * ### 특징
 * - `open` 상태를 기반으로 렌더링 여부가 결정됩니다.
 * - 배경 클릭 시 `setOpen(false)`로 닫힙니다.
 * - 아래로 스와이프하여 바텀시트를 닫을 수 있습니다 (100px 이상 드래그 시).
 * - 하단에서 슬라이드 업 애니메이션으로 나타납니다.
 * - 숫자 키패드를 통해 구매 수량을 입력할 수 있습니다.
 * - 입력한 수량에 따라 예상 체결가가 자동으로 계산됩니다.
 * - 최대 수량을 초과하는 입력 시 자동으로 최대 수량으로 제한됩니다.
 * - 취소 버튼 클릭 시 바텀시트가 닫히고 `onCancel` 콜백이 실행됩니다.
 * - 사기 버튼 클릭 시 입력한 수량을 `onConfirm` 콜백으로 전달합니다.
 * - 수량이 입력되지 않았거나 0일 경우 사기 버튼이 비활성화됩니다.
 *
 * ### 시각적 구성
 * - 반투명 어두운 배경(`bg-(--color-neutral-1)/50`)
 * - 흰색 바텀시트 컨테이너(`bg-(--color-neutral-6)`)
 * - 상단 핸들 바 (드래그 인디케이터)
 * - 제목 "주식 사기"
 * - 구매 가격 및 예상 체결가 표시 카드
 * - 수량 입력 영역 (플레이스홀더: "몇 주 구매할까요?")
 * - 숫자 키패드 (1-9, 00, 0, 백스페이스)
 * - 하단 취소/사기 버튼
 *
 * @component
 * @param {BottomSheetBuyStock} props - BottomSheetBuyStock 컴포넌트 속성
 * @returns {React.ReactElement} 바텀시트 요소
 *
 * @example
 * \`\`\`tsx
 * const [open, setOpen] = useState(false)
 *
 * <BottomSheetBuyStock
 *   open={open}
 *   setOpen={setOpen}
 *   price={280000}
 *   availableStocks={1000000}
 *   maxQuantity={3}
 *   onConfirm={(quantity) => {
 *     console.log(`구매 수량: ${quantity}주`)
 *     setOpen(false)
 *   }}
 *   onCancel={() => setOpen(false)}
 * />
 * \`\`\`
 */
export function BottomSheetBuyStock({
  open,
  setOpen,
  price,
  availableStocks,
  maxQuantity,
  onConfirm,
  onCancel,
}: BottomSheetBuyStock) {
  // 사용자가 입력한 주식 수량 (문자열로 관리하여 입력 중 상태 유지)
  const [quantity, setQuantity] = useState<string>("")

  // 드래그 시작 시 Y 좌표 (바텀시트를 아래로 스와이프하기 위한 기준점)
  const [dragStartY, setDragStartY] = useState<number>(0)

  // 현재 드래그 중인 Y 좌표 (시작점으로부터의 이동 거리)
  const [dragCurrentY, setDragCurrentY] = useState<number>(0)

  // 현재 드래그 중인지 여부
  const [isDragging, setIsDragging] = useState<boolean>(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // 바텀시트가 닫힐 때 모든 상태 초기화
  useEffect(() => {
    if (!open) {
      setQuantity("")
      setDragStartY(0)
      setDragCurrentY(0)
      setIsDragging(false)
    }
  }, [open])

  /**
   * 바텀시트의 반투명 배경(backdrop)을 클릭했을 때 닫히도록 하는 이벤트 핸들러입니다.
   * 클릭 이벤트의 타겟이 현재 바텀시트의 최상단 div(`backdrop`)일 경우에만 닫힙니다.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - 클릭 이벤트 객체
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false)
  }

  /**
   * 터치 시작 시 초기 Y 좌표를 저장하는 함수입니다.
   * 사용자가 바텀시트를 아래로 드래그하기 시작할 때 호출됩니다.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - 터치 이벤트 객체
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  /**
   * 터치 이동 시 현재 Y 좌표를 업데이트하는 함수입니다.
   * 아래로만 드래그 가능 (diff > 0)
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - 터치 이벤트 객체
   */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const diff = e.touches[0].clientY - dragStartY
    // 아래로만 드래그 가능 (diff > 0)
    if (diff > 0) setDragCurrentY(diff)
  }

  /**
   * 터치 종료 시 드래그 거리에 따라 바텀시트를 닫거나 원위치로 되돌리는 함수입니다.
   * 100px 이상 드래그하면 바텀시트가 닫히고, 그렇지 않으면 원래 위치로 돌아갑니다.
   */
  const handleTouchEnd = () => {
    if (!isDragging) return
    // 100px 이상 드래그하면 바텀시트 닫기
    if (dragCurrentY > 100) setOpen(false)
    // 드래그 상태 초기화
    setIsDragging(false)
    setDragStartY(0)
    setDragCurrentY(0)
  }

  /**
   * 숫자 키패드 버튼 클릭 시 수량 입력을 처리하는 함수입니다.
   * 입력된 값이 최대 수량을 초과하면 입력이 차단됩니다.
   * 앞의 불필요한 0은 자동으로 제거됩니다 (예: "002" → "2").
   *
   * @param {string} value - 입력할 숫자 값 ("1"-"9", "0", "00")
   */
  const handleNumberClick = (value: string) => {
    const newQuantity = quantity + value
    const trimmedQuantity = newQuantity.replace(/^0+/, "") || "0"
    const numericValue = Number.parseInt(trimmedQuantity)

    // 최대 수량을 초과하면 입력을 무시
    if (numericValue > maxQuantity) {
      return
    }

    setQuantity(trimmedQuantity)
  }

  /**
   * 백스페이스 버튼 클릭 시 마지막 입력 문자를 삭제하는 함수입니다.
   */
  const handleBackspace = () => {
    setQuantity(quantity.slice(0, -1))
  }

  /**
   * 취소 버튼 클릭 시 실행되는 함수입니다.
   * 바텀시트를 닫고 onCancel 콜백을 실행합니다.
   */
  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  /**
   * 사기 버튼 클릭 시 실행되는 함수입니다.
   * 입력한 수량이 0보다 클 경우에만 onConfirm 콜백으로 수량을 전달합니다.
   */
  const handleConfirm = () => {
    const qty = Number.parseInt(quantity) || 0
    if (qty > 0) onConfirm(qty)
  }

  // 예상 체결가 계산 (입력 수량 × 주당 가격)
  const expectedPrice = (Number.parseInt(quantity) || 0) * price

  /**
   * 숫자를 한국 로케일 형식으로 포맷팅하는 함수입니다.
   * 천 단위마다 콤마를 추가합니다 (예: 1000 → "1,000").
   * undefined, null, NaN 값은 "0"으로 반환합니다.
   *
   * @param {number} num - 포맷팅할 숫자
   * @returns {string} 포맷팅된 문자열
   */
  const formatNumber = (num: number) => (num && !Number.isNaN(num) ? num.toLocaleString("ko-KR") : "0")

  // 드래그 중일 때 바텀시트를 아래로 이동시키는 스타일
  const sheetStyle = isDragging ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" } : {}

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end bg-neutral-1/50 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-[480px] h-[85vh] rounded-t-[24px] bg-neutral-6 pb-[24px] shadow-lg transition-transform duration-300 overflow-hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 상단 핸들바 (드래그 인디케이터) */}
        <div className="flex justify-center pt-[12px] pb-[20px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4" />
        </div>

        {/* 제목 */}
        <h2 className="text-head-03 text-neutral-1 text-center mb-[20px]">주식 사기</h2>

        {/* 구매할 가격 정보 카드 */}
        <div className="mx-[20px] mb-[12px] rounded-[16px] bg-primary-1/8 px-[16px] py-[14px] text-left">
          <p className="text-body-07 text-neutral-1 mb-[8px]">구매할 가격</p>
          <p className="text-head-01 text-neutral-1 mb-[4px]">{formatNumber(price)}원</p>
          <p className="text-body-08 text-neutral-3">예상 체결가 {formatNumber(expectedPrice)}원</p>
        </div>

        {/* 수량 입력 카드 */}
        <div className="mx-[20px] mb-[24px] rounded-[16px] bg-primary-1/8 px-[16px] py-[14px] text-left">
          <p className="text-body-07 text-neutral-1 mb-[8px]">수량</p>
          {/* 수량이 입력되지 않았을 때 플레이스홀더 표시 */}
          <p className={`text-head-01 mb-[4px] ${quantity ? "text-neutral-1" : "text-neutral-4"}`}>
            {quantity || "몇 주 구매할까요?"}
          </p>
          <p className="text-body-08 text-neutral-3">
            구매가능 {formatNumber(availableStocks)}원 · 최대 {maxQuantity}주
          </p>
        </div>

        {/* 숫자 키패드 (1-9, 00, 0, 백스페이스) */}
        <div className="mx-[20px] mb-[20px] grid grid-cols-3 gap-x-[16px] gap-y-[12px] py-[7px]">
          {/* 1-9 숫자 버튼 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-[40px] text-head-00 text-neutral-2 rounded-[12px] hover:bg-monochrome-lightgray active:bg-monochrome-gray transition-colors"
            >
              {num}
            </button>
          ))}
          {/* 00 버튼 */}
          <button
            onClick={() => handleNumberClick("00")}
            className="h-[40px] text-head-00 text-neutral-2 rounded-[12px] hover:bg-monochrome-lightgray active:bg-monochrome-gray transition-colors"
          >
            00
          </button>
          {/* 0 버튼 */}
          <button
            onClick={() => handleNumberClick("0")}
            className="h-[40px] text-head-00 text-neutral-2 rounded-[12px] hover:bg-monochrome-lightgray active:bg-monochrome-gray transition-colors"
          >
            0
          </button>
          {/* 백스페이스 버튼 */}
          <button
            onClick={handleBackspace}
            className="h-[40px] flex items-center justify-center rounded-[12px] text-neutral-2 hover:bg-monochrome-lightgray active:bg-neutral-5"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 하단 액션 버튼 (취소, 사기) */}
        <div className="mx-[20px] flex gap-[12px]">
          {/* 취소 버튼 */}
          <button
            onClick={handleCancel}
            className="flex-1 h-[56px] rounded-[16px] bg-monochrome-gray text-body-04 text-neutral-1 hover:bg-monochrome-lightgray active:bg-neutral-5"
          >
            취소
          </button>
          {/* 구매(사기) 버튼 - 수량이 입력되지 않았거나 0이면 비활성화 */}
          <button
            onClick={handleConfirm}
            disabled={!quantity || Number.parseInt(quantity) === 0}
            className="flex-1 h-[56px] rounded-[16px] bg-primary-1 text-body-04 text-neutral-6 hover:bg-[#005a96] active:bg-[#004d80] disabled:opacity-50"
          >
            사기
          </button>
        </div>
      </div>
    </div>
  )
}
