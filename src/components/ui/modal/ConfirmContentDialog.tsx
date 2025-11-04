"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ConfirmContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  content?: string
  leftText?: string
  rightText?: string
  onClickLeftBtn?: () => void
  onClickRightBtn?: () => void
}

export function ConfirmContentDialog({
  open,
  onOpenChange,
  title = "피드백 확인",
  content = "가을은 변화의 계절입니다. 나뭇잎이 붉게 물들고 바람이 선선해지면 사람들의 마음도 차분해집니다. 새로운 계획을 세우기 좋은 시기이기도 합니다. 지나온 시간을 돌아보고 앞으로의 방향을 점검하며 자신을 다듬는 계절, 그것이 가을입니다.",
  leftText = "취소",
  rightText = "삭제",
  onClickLeftBtn,
  onClickRightBtn,
}: ConfirmContentDialogProps) {
  const handleLeftBtn = () => {
    onClickLeftBtn?.()
    onOpenChange(false)
  }

  const handleRightBtn = () => {
    onClickRightBtn?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[270px] p-0 gap-0 rounded-[14px] bg-white backdrop-blur-[27.1828px]"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col justify-between items-start w-[270px]">
          {/* Content Section - auto height */}
          <div className="flex flex-col justify-between items-center w-[270px] pt-[24px] pb-[16px] gap-[16px]">
            {/* Title */}
            <div className="w-[238px]">
              <h2
                className="text-head-06 text-neutral-1 text-center"
              >
                {title}
              </h2>
            </div>

            {/* Input Box with Content - responsive height */}
            <div className="flex items-start w-[238px] rounded-md px-3 py-2 bg-monochrome-lightgray border border-neutral-4">
              <div className="w-full">
                <p className="text-body-07 text-neutral-3">
                  {content}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row - 44px height */}
          <div className="relative w-[270px] h-[44px]">
            <div className="absolute flex items-center w-[270px] h-[44px] left-0 top-0">
              {/* Cancel Button */}
              <button
                onClick={handleLeftBtn}
                className="flex items-center justify-center w-[134px] h-[44px] text-body-04 text-info text-center">
                {leftText}
              </button>

              {/* Center Separator */}
              <div className="w-[1px] h-[16px] bg-neutral-4"/>

              {/* Delete Button */}
              <button
                onClick={handleRightBtn}
                className="flex items-center justify-center w-[135px] h-[44px] text-head-06 text-error text-center"
                >
                {rightText}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
