"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ConfirmContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string
  leftText: string
  rightText: string
  onClickLeftBtn?: () => void
  onClickRightBtn?: () => void
}

export function ConfirmContentDialog({
  open,
  onOpenChange,
  title,
  content,
  leftText,
  rightText,
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
          {/* Content Section */}
          <div className="flex flex-col justify-between items-center w-[270px] pt-[24px] pb-[16px] gap-[16px]">
            {/* Title */}
            <div className="w-[238px]">
              <h2 className="text-head-06 text-neutral-1 text-center">{title}</h2>
            </div>

            {/* Content Box */}
            <div className="flex items-start w-[238px] rounded-md px-3 py-2 bg-monochrome-lightgray border border-neutral-4">
              <p className="w-full text-body-07 text-neutral-3">
                {content}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative w-[270px] h-[44px]">
            <div className="flex w-full h-[44px] border-t border-neutral-4">
              {/* Left Button */}
              <button
                onClick={handleLeftBtn}
                className="flex-1 flex items-center justify-center h-full text-body-04 text-info text-center"
              >
                {leftText}
              </button>

              {/* Divider */}
              <div className="w-[1px] h-[16px] self-center bg-neutral-4" />

              {/* Right Button */}
              <button
                onClick={handleRightBtn}
                className="flex-1 flex items-center justify-center h-full text-head-06 text-error text-center"
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
