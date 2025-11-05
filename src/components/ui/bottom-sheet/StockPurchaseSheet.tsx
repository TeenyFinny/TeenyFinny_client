"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

/**
 * StockPurchaseModalProps
 * @typedef {Object} StockPurchaseBottomSheetProps
 * @property {boolean} open - 모달의 열림 여부를 제어합니다. `true`일 때 모달이 표시됩니다.
 * @property {(open: boolean) => void} setOpen - 모달의 열림 상태를 변경하는 setter 함수입니다.
 * @property {number} price - 주식의 구매 가격입니다.
 * @property {number} availableFunds - 구매 가능한 금액입니다.
 * @property {number} maxQuantity - 구매 가능한 최대 주식 수량입니다.
 * @property {(quantity: number) => void} onConfirm - 사기 버튼 클릭 시 선택한 수량을 전달하는 콜백 함수입니다.
 * @property {() => void} [onCancel] - 취소 버튼 클릭 시 실행될 콜백 함수입니다. (선택사항)
 */
interface StockPurchaseBottomSheet {
  open: boolean
  setOpen: (open: boolean) => void
  price: number
  availableFunds: number
  maxQuantity: number
  onConfirm: (quantity: number) => void
  onCancel?: () => void
}

/**
 * StockPurchaseModal
 *
 * 주식 구매를 위한 수량 입력 바텀시트 컴포넌트입니다.
 *
 * ### 특징
 * - `open` 상태를 기반으로 렌더링 여부가 결정됩니다.
 * - 배경 클릭 시 `setOpen(false)`로 닫힙니다.
 * - 아래로 스와이프하여 바텀시트를 닫을 수 있습니다.
 * - 하단에서 슬라이드 업 애니메이션으로 나타납니다.
 * - 숫자 키패드를 통해 구매 수량을 입력할 수 있습니다.
 * - 입력한 수량에 따라 예상 체결가가 자동으로 계산됩니다.
 * - 취소 버튼 클릭 시 바텀시트가 닫히고 `onCancel` 콜백이 실행됩니다.
 * - 사기 버튼 클릭 시 입력한 수량을 `onConfirm` 콜백으로 전달합니다.
 *
 * ### 시각적 구성
 * - 반투명 어두운 배경(`bg-[#000000]/50`)
 * - 흰색 컨테이너(`bg-[#ffffff]`)
 * - 상단 핸들 바
 * - 제목 "주식 사기"
 * - 구매 가격 및 예상 체결가 표시 카드
 * - 수량 입력 영역
 * - 숫자 키패드 (1-9, 00, 0, 백스페이스)
 * - 하단 취소/사기 버튼
 *
 * @component
 * @param {StockPurchaseModalProps} props - StockPurchaseModal 컴포넌트 속성
 * @returns {React.ReactElement | null} 열림 상태일 경우 바텀시트 요소, 닫힘 상태일 경우 `null`
 *
 * @example
 * \`\`\`tsx
 * const [open, setOpen] = useState(false)
 *
 * <StockPurchaseModal
 *   open={open}
 *   setOpen={setOpen}
 *   price={280000}
 *   availableFunds={1000000}
 *   maxQuantity={3}
 *   onConfirm={(quantity) => {
 *     console.log(`구매 수량: ${quantity}주`)
 *     setOpen(false)
 *   }}
 *   onCancel={() => setOpen(false)}
 * />
 * \`\`\`
 */
export function StockPurchaseBottomSheet({
  open,
  setOpen,
  price,
  availableFunds,
  maxQuantity,
  onConfirm,
  onCancel,
}: StockPurchaseBottomSheet) {
  const [quantity, setQuantity] = useState<string>("")
  const [dragStartY, setDragStartY] = useState<number>(0)
  const [dragCurrentY, setDragCurrentY] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // 모달이 닫힐 때 수량 초기화
  useEffect(() => {
    if (!open) {
      setQuantity("")
      setDragStartY(0)
      setDragCurrentY(0)
      setIsDragging(false)
    }
  }, [open])

  if (!open) return null

  /**
   * 모달의 반투명 배경(backdrop)을 클릭했을 때 닫히도록 하는 이벤트 핸들러입니다.
   * 클릭 이벤트의 타겟이 현재 모달의 최상단 div(`backdrop`)일 경우에만 닫힙니다.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - 클릭 이벤트 객체
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }

  /**
   * 터치 시작 시 초기 Y 좌표를 저장하는 함수입니다.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - 터치 이벤트 객체
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  /**
   * 터치 이동 시 현재 Y 좌표를 업데이트하는 함수입니다.
   * 아래로만 드래그할 수 있도록 제한합니다.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - 터치 이벤트 객체
   */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = currentY - dragStartY
    // 아래로만 드래그 가능 (diff > 0)
    if (diff > 0) {
      setDragCurrentY(diff)
    }
  }

  /**
   * 터치 종료 시 드래그 거리에 따라 바텀시트를 닫거나 원위치로 되돌리는 함수입니다.
   * 100px 이상 드래그하면 바텀시트가 닫힙니다.
   */
  const handleTouchEnd = () => {
    if (!isDragging) return
    const CLOSE_THRESHOLD = 100 // 100px 이상 드래그하면 닫힘

    if (dragCurrentY > CLOSE_THRESHOLD) {
      setOpen(false)
    }

    // 드래그 상태 초기화
    setIsDragging(false)
    setDragStartY(0)
    setDragCurrentY(0)
  }

  /**
   * 숫자 키패드 버튼 클릭 시 수량 입력을 처리하는 함수입니다.
   *
   * @param {string} value - 입력할 숫자 값 ("1"-"9", "0", "00")
   */
  const handleNumberClick = (value: string) => {
    const newQuantity = quantity + value
    const numericValue = Number.parseInt(newQuantity)

    if (numericValue > maxQuantity) {
      // 최대 수량을 초과하면 최대 수량으로 설정
      setQuantity(maxQuantity.toString())
    } else {
      setQuantity(newQuantity)
    }
  }

  /**
   * 백스페이스 버튼 클릭 시 마지막 입력 문자를 삭제하는 함수입니다.
   */
  const handleBackspace = () => {
    setQuantity(quantity.slice(0, -1))
  }

  /**
   * 취소 버튼 클릭 시 실행되는 함수입니다.
   * 모달을 닫고 onCancel 콜백을 실행합니다.
   */
  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  /**
   * 사기 버튼 클릭 시 실행되는 함수입니다.
   * 입력한 수량을 onConfirm 콜백으로 전달합니다.
   */
  const handleConfirm = () => {
    const qty = Number.parseInt(quantity) || 0
    if (qty > 0) {
      onConfirm(qty)
    }
  }

  // 예상 체결가 계산
  const expectedPrice = (Number.parseInt(quantity) || 0) * price

  // 숫자 포맷팅 함수
  const formatNumber = (num: number) => {
    // undefined, null, NaN 체크
    if (num === undefined || num === null || Number.isNaN(num)) {
      return "0"
    }
    return num.toLocaleString("ko-KR")
  }

  const sheetStyle = isDragging
    ? {
        transform: `translateY(${dragCurrentY}px)`,
        transition: "none",
      }
    : {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#000000]/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[20px] bg-[#ffffff] pb-8 shadow-lg animate-in slide-in-from-bottom duration-300"
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 상단 핸들 바 */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-[60px] h-[4px] rounded-full bg-[#cacaca]" />
        </div>

        {/* 제목 */}
        <h2 className="text-head-00 text-[#000000] text-center mb-6">주식 사기</h2>

        {/* 구매 가격 카드 */}
        <div className="mx-6 mb-4 rounded-[12px] bg-[#E8EBEE] p-5">
          <p className="text-body-07 text-[#898989] mb-2">구매할 가격</p>
          <p className="text-head-00 text-[#000000] mb-1">{formatNumber(price)}원</p>
          <p className="text-body-08 text-[#898989]">예상 체결가 {formatNumber(expectedPrice)}원</p>
        </div>

        {/* 수량 입력 카드 */}
        <div className="mx-6 mb-6 rounded-[12px] bg-[#E8EBEE] p-5">
          <p className="text-body-07 text-[#898989] mb-2">수량</p>
          <p className={`text-head-00 mb-1 whitespace-pre-line ${quantity ? "text-[#000000]" : "text-[#cacaca]"}`}>
            {quantity || "몇 주 구매할까요?"}
          </p>
          <p className="text-body-08 text-[#898989]">
            구매가능 {formatNumber(availableFunds)}원 · 최대 {maxQuantity}주
          </p>
          
        </div>

        {/* 숫자 키패드 */}
        <div className="mx-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            {/* 1-9 버튼 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-[60px] text-head-00 text-[#898989] hover:bg-[#F6F7F8] rounded-lg transition-colors active:bg-[#E8EBEE]"
              >
                {num}
              </button>
            ))}
            {/* 00 버튼 */}
            <button
              onClick={() => handleNumberClick("00")}
              className="h-[60px] text-head-00 text-[#898989] hover:bg-[#F6F7F8] rounded-lg transition-colors active:bg-[#E8EBEE]"
            >
              00
            </button>
            {/* 0 버튼 */}
            <button
              onClick={() => handleNumberClick("0")}
              className="h-[60px] text-head-00 text-[#898989] hover:bg-[#F6F7F8] rounded-lg transition-colors active:bg-[#E8EBEE]"
            >
              0
            </button>
            {/* 백스페이스 버튼 */}
            <button
              onClick={handleBackspace}
              className="h-[60px] flex items-center justify-center text-[#898989] hover:bg-[#F6F7F8] rounded-lg transition-colors active:bg-[#E8EBEE]"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mx-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 h-[56px] rounded-[12px] bg-[#E8EBEE] text-body-04 text-[#343434] hover:bg-[#cacaca] transition-colors active:bg-[#bcbcbc]"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!quantity || Number.parseInt(quantity) === 0}
            className="flex-1 h-[56px] rounded-[12px] bg-[#0067ac] text-body-04 text-[#ffffff] hover:bg-[#005a94] transition-colors active:bg-[#004d7d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            사기
          </button>
        </div>
      </div>
    </div>
  )
}
