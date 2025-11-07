"use client"

import type React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmDisabledInputDialogProps {
  trigger?: React.ReactNode
  title?: string
  lab1?: string
  lab2?: string
  inputVal1?: string
  inputVal2?: string
  ltBtnText?: string
  rtBtnText?: string
  onClickLtBtn?: () => void
  onClickRtBtn?: () => void
}

export function ConfirmDisabledInputDialog({
  trigger,
  title,
  lab1,
  lab2,
  inputVal1,
  inputVal2,
  ltBtnText,
  rtBtnText,
  onClickLtBtn,
  onClickRtBtn,
}: ConfirmDisabledInputDialogProps) {
  return (
    <AlertDialog>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="w-[270px] p-0 gap-0 rounded-[14px] backdrop-blur-[27px]">
        <AlertDialogHeader className="px-5 pt-4.5 pb-4 space-y-3 text-center">
          <AlertDialogTitle className="text-center">
            <span className="text-head-06 text-(--color-neutral-1)">{title}</span>
            </AlertDialogTitle>
        </AlertDialogHeader>
          {/* Form Content */}
        <div className="w-full px-4 pb-4.5 flex flex-col gap-4">
          {/* Amount Input */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-4 text-body-07">{lab1}</label>
            <input
              type="text"
              value={inputVal1}
              disabled
              placeholder={lab1}
              className="w-full px-4 py-3 bg-(--color-monochrome-lightgray) rounded-[6px] text-body-08 text-neutral-3 border-0 outline-none cursor-not-allowed"
            />
          </div>

          {/* Reason Input */}
          <div className="flex flex-col gap-1">
            <label className="text-neutral-4 text-body-07">{lab2}</label>
            <input
              type="text"
              value={inputVal2}
              disabled
              placeholder={lab2}
              className="w-full px-4 py-3 bg-(--color-monochrome-lightgray) rounded-[6px] text-body-08 text-neutral-3 placeholder:text-neutral-3 border-0 outline-none cursor-not-allowed"
            />
          </div>
        </div>
        <AlertDialogFooter className="flex-row p-0 m-0 gap-0">
          <AlertDialogCancel
            onClick={onClickLtBtn}
            className="flex-1 m-0 h-12 rounded-none rounded-bl-[14px] border-0  hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-(--color-info)">{ltBtnText}</span>
          </AlertDialogCancel>
          <div className="w-px bg-(--color-neutral-5) my-3" />
          <AlertDialogAction
            onClick={onClickRtBtn}
            className="flex-1 m-0 h-12 rounded-none rounded-br-[14px] border-0 bg-transparent  hover:bg-transparent transition-colors"
            >
            <span className="text-body-04 text-(--color-error)">{rtBtnText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
