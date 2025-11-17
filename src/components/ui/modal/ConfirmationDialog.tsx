"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText: string
  onConfirm?: () => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[270px] gap-0 p-0 rounded-[14px] border-0"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-start w-full min-h-[138px] rounded-[14px]">
          <div className="flex flex-col items-center w-full min-h-[94px] pt-6 pb-5 px-4 gap-[14px]">
            <h2 className="text-head-06 text-neutral-1 text-center">{title}</h2>
            <p className="text-body-07 text-neutral-3 text-center">{description}</p>
          </div>

          <div className="flex items-center justify-center w-full h-[44px]">
            <button onClick={handleConfirm} className="w-full h-full text-body-04 text-primary-1 text-center">
              {confirmText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
