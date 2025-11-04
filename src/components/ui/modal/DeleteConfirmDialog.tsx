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
  cancelText?: string
  deleteText?: string
  onCancel?: () => void
  onDelete?: () => void
}

export function DeleteConfirmDialog({
  trigger,
  title ,
  description,
  cancelText,
  deleteText,
  onCancel,
  onDelete,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="w-[270px] p-0 gap-0 rounded-[14px] backdrop-blur-[27px]">
        <AlertDialogHeader className="px-6 pt-6 pb-4 space-y-3 text-center">
          <AlertDialogTitle>
            <span className="text-head-03 text-(--color-neutral-1)">{title}</span>
            </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-body-07 text-(--color-neutral-3)">{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row p-0 m-0 gap-0 ">
          <AlertDialogCancel
            onClick={onCancel}
            className="flex-1 m-0 h-12 rounded-none rounded-bl-[14px] border-0  hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-(--color-info)">{cancelText}</span>
          </AlertDialogCancel>
          <div className="w-px bg-(--color-neutral-5) my-3" />
          <AlertDialogAction
            onClick={onDelete}
            className="flex-1 m-0 h-12 rounded-none rounded-br-[14px] border-0 bg-transparent  hover:bg-transparent transition-colors"
          >
            <span className="text-body-04 text-(--color-error)">{deleteText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
