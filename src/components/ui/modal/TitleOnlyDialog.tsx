"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

/**
 * TitleOnlyDialog 컴포넌트
 *
 * 재사용 가능한 확인(Confirm) 다이얼로그 컴포넌트입니다.
 * 제목과 버튼 텍스트를 커스터마이즈할 수 있습니다.
 *
 * @param {boolean} open - 다이얼로그 표시 여부
 * @param {function} onOpenChange - 다이얼로그 열림 상태 변경 콜백
 * @param {string} title - 다이얼로그 제목 텍스트 (\n 으로 줄바꿈 지원)
 * @param {string} confirmText - 확인 버튼 텍스트
 * @param {function} onConfirm - 확인 버튼 클릭 시 호출되는 콜백
 */
interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  confirmText?: string
  onConfirm?: () => void
}

export function TitleOnlyDialog({
  open,
  onOpenChange,
  title = "경고메시지",
  confirmText = "확인",
  onConfirm,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[270px] p-0 gap-0 rounded-[14px] border-0 bg-neutral-7 backdrop-blur-[27.18px]"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Content 영역 (위 24px, 좌우 0, 아래 20px) + 요소 간격 14px */}
        <DialogHeader className="flex items-center px-0 pt-6 pb-5 gap-[14px]">
          {/* 제목: 238×19px 스펙 준수 */}
          <DialogTitle className="text-head-06 text-neutral-1 text-center whitespace-pre-line leading-[19px] w-[238px] mx-auto">
            {title}
          </DialogTitle>

          {/* 설명: 디자인 상 비표시 (display:none) */}
          <DialogDescription className="hidden w-[238px] text-center">
            {/* 비워둠 (디자인 요구사항: 숨김 처리) */}
          </DialogDescription>
        </DialogHeader>

        {/* 액션 영역 / 높이 44px */}
        <DialogFooter className="p-0 m-0 w-[270px] h-[44px]">
          <button
            onClick={handleConfirm}
            className="w-full h-[44px] text-body-04 text-primary-1 text-center whitespace-pre-line"
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
