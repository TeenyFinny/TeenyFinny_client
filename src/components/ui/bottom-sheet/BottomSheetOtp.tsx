"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import OtpInput from "@/components/custom/family/OtpInput"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"

interface BottomSheetOtpProps {
  open: boolean
  setOpen: (open: boolean) => void
  onComplete: (otp: string) => Promise<void> | void
  shouldOverlayBottomBar?: boolean
  error?: string | null
  initialOtp?: string // 초기 인증번호 값
}

/**
 * BottomSheetOtp
 *
 * 인증번호를 입력할 수 있는 바텀시트 컴포넌트
 */
export function BottomSheetOtp({ open, setOpen, onComplete, shouldOverlayBottomBar = false, error, initialOtp }: BottomSheetOtpProps) {
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      setDragStartY(0)
      setDragCurrentY(0)
      setIsDragging(false)
      setOtp("") // 닫을 때 초기화
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // initialOtp가 변경되거나 바텀시트가 열릴 때 인증번호 자동 입력
  useEffect(() => {
    if (open && initialOtp && initialOtp.length === 6) {
      // 바텀시트가 열려있고 initialOtp가 6자리면 자동으로 입력
      // 약간의 지연을 두어 바텀시트 애니메이션과 동기화
      const timer = setTimeout(() => {
        setOtp(initialOtp)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [open, initialOtp])

  const handleDragStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartY(e.touches[0].clientY)
  }

  const handleDragMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = currentY - dragStartY
    if (diff > 0) {
      setDragCurrentY(diff)
    }
  }

  const handleDragEnd = () => {
    if (dragCurrentY > 100) {
      setOpen(false)
    }
    setIsDragging(false)
    setDragStartY(0)
    setDragCurrentY(0)
  }

  const handleSubmit = async () => {
    if (otp.length !== 6) return

    // 에러가 있는 상태에서 확인 버튼을 다시 누르면 바텀시트 닫기
    if (error) {
      setOpen(false)
      return
    }

    setIsSubmitting(true)
    try {
      await onComplete(otp)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  const translateY = isDragging ? dragCurrentY : 0

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-neutral-1/50 z-40" onClick={() => setOpen(false)} />
      {/* 바텀시트 */}
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-[20px] z-50 ${shouldOverlayBottomBar ? "pb-0" : "pb-[56px]"}`}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* 드래그 핸들 */}
        <div className="w-full h-[30px] flex items-center justify-center pt-2" onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
          <div className="w-[40px] h-[4px] bg-neutral-3 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-head-06 text-neutral-1">인증번호 입력</h2>
          <button onClick={() => setOpen(false)} className="p-2 -mr-2" aria-label="닫기">
            <X className="w-6 h-6 text-neutral-3" />
          </button>
        </div>

        {/* OTP 입력 */}
        <div className="px-6 pb-6">
          <OtpInput value={otp} onChange={setOtp} error={!!error} />
          {error && <p className="text-error text-body-08 text-center mt-2">{error}</p>}
        </div>

        {/* 버튼 */}
        <div className="px-6 pb-6">{otp.length === 6 ? <BigButtonActivated label="확인" onClick={handleSubmit} /> : <BigButtonDisabled label="확인" onClick={() => {}} />}</div>
      </div>
    </>
  )
}
