"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, X } from "lucide-react"

export function BottomSheetPassword({
  open,
  setOpen,
  onComplete,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onComplete: (pin: string) => void
}) {
  const [pin, setPin] = useState("")
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (open) {
      // 바텀시트가 새로 열릴 때마다 PIN 초기화
      setPin("")
    } else {
      // 닫힐 때 드래그 상태 초기화
      setDragStartY(0)
      setDragCurrentY(0)
      setIsDragging(false)
    }
  }, [open])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const diff = e.touches[0].clientY - dragStartY
    if (diff > 0) setDragCurrentY(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    if (dragCurrentY > 100) setOpen(false)
    setIsDragging(false)
    setDragStartY(0)
    setDragCurrentY(0)
  }

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num
      setPin(newPin)
      if (newPin.length === 6) {
        setTimeout(() => onComplete(newPin), 300)
      }
    }
  }

  const handleDelete = () => setPin(pin.slice(0, -1))
  const handleReset = () => setPin("")

  const sheetStyle = isDragging ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" } : {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-1/50"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-[480px] h-[60vh] relative rounded-t-[24px] bg-neutral-6 pb-[32px] shadow-lg transition-transform duration-300 overflow-hidden"
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 핸들바 */}
        <div className="flex justify-center pt-[12px] pb-[20px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4/50" />
        </div>

        {/* X 닫기 버튼 - 상단 30px, 오른쪽 30px */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-[40px] right-[30px] text-neutral-2 hover:text-neutral-1"
          aria-label="닫기"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* 제목 */}
        <h2 className="text-head-01 text-center text-neutral-1 mt-[40px] mb-[28px]">간편비밀번호</h2>

        {/* 비밀번호 점 */}
        <div className="flex flex-col items-center pt-[16px] pb-[16px]">
          <div className="flex justify-center items-center gap-[18px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border border-neutral-4) ${
                  pin.length > i ? "bg-neutral-4" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 숫자 키패드 */}
        <div className="mx-[20px] mt-[20px] mb-[20px] grid grid-cols-3 gap-x-[16px] gap-y-[12px] py-[7px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-[40px] text-head-00 text-neutral-2 rounded-[12px] hover:bg-monochrome-lightgray active:bg-monochrome-gray transition-colors"
            >
              {num}
            </button>
          ))}

          {/* 전체삭제 */}
          <button onClick={handleReset} className="text-body-04 text-neutral-2">
            전체삭제
          </button>

          {/* 0 */}
          <button onClick={() => handleNumberClick("0")} className="text-head-00 text-neutral-2">
            0
          </button>

          {/* ← 삭제 */}
          <button onClick={handleDelete} className="flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-neutral-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
