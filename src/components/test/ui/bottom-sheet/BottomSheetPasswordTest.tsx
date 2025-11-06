"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword"

export default function Home() {
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false)
  const [passwordResult, setPasswordResult] = useState<string>("")

  const handlePasswordComplete = (password: string) => {
    setPasswordResult(`입력한 비밀번호: ${password}`)
    setIsPasswordSheetOpen(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-monochrome-lightgray) p-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-head-01 text-(--color-neutral-1)">간편 비밀번호 바텀시트 테스트</h1>
          <p className="text-body-05 text-(--color-neutral-2)">버튼을 클릭하여 비밀번호 입력 바텀시트를 열어보세요</p>
        </div>

        <Button
          onClick={() => setIsPasswordSheetOpen(true)}
          className="bg-(--color-primary-1) hover:bg-[#005a94] text-(--color-neutral-7) px-8 py-6 text-body-04"
        >
          비밀번호 입력하기
        </Button>

        {passwordResult && (
          <div className="mt-6 p-4 rounded-lg bg-(--color-monochrome-gray)">
            <p className="text-body-05 text-(--color-neutral-1) whitespace-pre-line">{passwordResult}</p>
          </div>
        )}

        <BottomSheetPassword
          open={isPasswordSheetOpen}
          setOpen={setIsPasswordSheetOpen}
          onComplete={handlePasswordComplete}
        />
      </div>
    </main>
  )
}
