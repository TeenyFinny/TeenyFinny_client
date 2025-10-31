"use client"

interface ConfirmationDialogProps {
  title?: string
  description?: string
  confirmText?: string
  onConfirm?: () => void
  className?: string
}

export function ConfirmationDialog({
  title = "확인하셨나요?",
  description = "삭제하면 되돌릴 수 없어요",
  confirmText = "확인",
  onConfirm,
  className = "",
}: ConfirmationDialogProps) {
  return (
    <div
      className={`flex flex-col items-start bg-[#FFFFFF] rounded-[14px] backdrop-blur-[27.18px] overflow-hidden ${className}`}
    >
      {/* Content Section */}
      <div className="flex flex-col items-center gap-0.4 px-6 pt-5 pb-6 w-full h-[76px]">
        <h2 className="text-head-06 text-neutral-1 text-center">{title}</h2>
        <p className="text-body-07 text-neutral-3 text-center">{description}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#E0E0E0]" />

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="w-full h-[44px] py-3 text-head-06 text-info hover:bg-[#F7F9F9] transition-colors"
      >
        {confirmText}
      </button>
    </div>
  )
}
