"use client"

import type React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description: React.ReactNode
  ltBtnTxt: string
  rtBtnTxt: string
  onClickLtBtn?: () => void
  onClickRtBtn?: () => void
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  ltBtnTxt,
  rtBtnTxt,
  onClickLtBtn,
  onClickRtBtn,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="w-[270px] p-0 gap-0 rounded-[14px] backdrop-blur-[27px]">
        <AlertDialogHeader className="px-4 text-center ">
          <AlertDialogTitle className="text-center mt-[24px] mb-[4px] leading-none">
            <span className="text-head-06 text-neutral-1 font-semibold">{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center mb-[20px] leading-none">
            <span className="text-body-07 text-neutral-3">{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row  p-0 m-0 gap-0">
          <AlertDialogCancel
            onClick={onClickLtBtn}
            className="flex-1 m-0 h-11 rounded-none rounded-bl-[14px] border-0 hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-info">{ltBtnTxt}</span>
          </AlertDialogCancel>
          <div className="w-px bg-neutral-5 my-3" />
          <AlertDialogAction
            onClick={onClickRtBtn}
            className="flex-1 m-0 h-11 rounded-none rounded-br-[14px] border-0 bg-transparent hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-error">{rtBtnTxt}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
