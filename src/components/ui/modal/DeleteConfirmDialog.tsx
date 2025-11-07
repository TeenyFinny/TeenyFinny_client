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
  trigger?: React.ReactNode
  title?: string
  description?: string
  ltBtnTxt?: string
  rtBtnTxt?: string
  onClickLtBtn?: () => void
  onClickRtBtn?: () => void
}

export function DeleteConfirmDialog({
  trigger,
  title ,
  description,
  ltBtnTxt,
  rtBtnTxt,
  onClickLtBtn,
  onClickRtBtn,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="w-[270px] p-0 gap-0 rounded-[14px] backdrop-blur-[27px]">
        <AlertDialogHeader className="px-4 pt-6 pb-5 space-y-3 text-center">
          <AlertDialogTitle className="text-center">
            <span className="text-head-06 text-neutral-1">{title}</span>
            </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <span className="text-body-07 text-neutral-3">{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row p-0 m-0 gap-0 ">
          <AlertDialogCancel
            onClick={onClickLtBtn}
            className="flex-1 m-0 h-12 rounded-none rounded-bl-[14px] border-0  hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-info">{ltBtnTxt}</span>
          </AlertDialogCancel>
          <div className="w-px bg-neutral-5 my-3" />
          <AlertDialogAction
            onClick={onClickRtBtn}
            className="flex-1 m-0 h-12 rounded-none rounded-br-[14px] border-0 bg-transparent  hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-error">{rtBtnTxt}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
