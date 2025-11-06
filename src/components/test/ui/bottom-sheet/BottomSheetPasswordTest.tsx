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
    <main className="flex min-h-screen items-center justify-center bg-monochrome-lightgray p-[32px]">
      <div className="text-center space-y-[24px]">
        <div className="space-y-[8px]">
          <h1 className="text-head-01 text-neutral-1">간편 비밀번호 바텀시트 테스트</h1>
          <p className="text-body-05 text-neutral-2">버튼을 클릭하여 비밀번호 입력 바텀시트를 열어보세요</p>
        </div>

        <Button
          onClick={() => setIsPasswordSheetOpen(true)}
          className="bg-primary-1 hover:bg-[#005a94] text-neutral-7 px-[32px] py-[24px] text-body-04"
        >
          비밀번호 입력하기
        </Button>

        {passwordResult && (
          <div className="mt-[24px] p-[16px] rounded-lg bg-monochrome-gray">
            <p className="text-body-05 text-neutral-1 whitespace-pre-line">{passwordResult}</p>
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
