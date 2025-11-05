"use client"

import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog"
import { useState } from "react"


export default function ModalTest() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    alert("확인 버튼 클릭됨!")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <button onClick={() => setOpen(true)} className="px-6 py-3 bg-primary-1 text-neutral-7 rounded-lg text-body-04">
        다이얼로그 열기
      </button>

      <TitleOnlyDialog
        open={open}
        onOpenChange={setOpen}
        title="경고메시지"
        confirmText="확인"
        onConfirm={handleConfirm}
      />
    </div>
  )
}
