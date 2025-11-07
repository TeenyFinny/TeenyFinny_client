"use client"

import type React from "react"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmInputDialogProps {
  trigger?: React.ReactNode
  title?: string
  lab1?: string
  lab2?: string
  inputVal1?: string
  inputVal2?: string
  btnText?: string
  onClickBtn?: (inputVal1: string, inputVal2: string) => void
}

export function ConfirmInputDialog({
  trigger,
  title,
  lab1,
  lab2,
  inputVal1="",
  inputVal2="",
  btnText,
  onClickBtn,
}: ConfirmInputDialogProps) {
  const [value1, setValue1] = useState(inputVal1)
  const [value2, setValue2] = useState(inputVal2)
  
 
  return (
    <AlertDialog>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="w-[270px] p-0 gap-0 rounded-[14px] backdrop-blur-[27px]">
        <AlertDialogHeader className="px-5 pt-4.5 pb-4 space-y-3 text-center">
          <AlertDialogTitle className="text-center">
            <span className="text-head-06 text-neutral-1">{title}</span>
            </AlertDialogTitle>
        </AlertDialogHeader>
          {/* Form Content */}
        <div className="w-full px-4 pb-4.5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="input-1" className="text-neutral-3 text-body-07">{lab1}</label>
            <input
              id="input-1"
              type="text"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-7 rounded-[6px] text-body-08 text-neutral-1 border-1 border-neutral-3"
              placeholder={lab1}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="input-2" className="text-neutral-3 text-body-07">{lab2}</label>
            <input
              id="input-2"
              type="text"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder={lab2}
              className="w-full px-4 py-3 bg-neutral-7 rounded-[6px] text-body-08 text-neutral-1 border-1 border-neutral-3"
            />
          </div>
        </div>
        <AlertDialogFooter className="flex-row p-0 m-0 gap-0">
          <AlertDialogAction
            onClick={() => onClickBtn?.(value1, value2)}
            className="flex-1 m-0 h-12 rounded-[14px] border-0 hover:bg-transparent transition-colors bg-neutral-7"
          >
            <span className="text-body-04 text-info">{btnText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
