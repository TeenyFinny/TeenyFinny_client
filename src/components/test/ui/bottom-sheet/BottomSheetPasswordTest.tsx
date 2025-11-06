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
    <main className="flex min-h-screen items-center justify-center bg-[#F6F7F8] p-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-head-01 text-[#000000]">간편 비밀번호 바텀시트 테스트</h1>
          <p className="text-body-05 text-[#898989]">버튼을 클릭하여 비밀번호 입력 바텀시트를 열어보세요</p>
        </div>

        <Button
          onClick={() => setIsPasswordSheetOpen(true)}
          className="bg-[#0067ac] hover:bg-[#005a94] text-[#ffffff] px-8 py-6 text-body-04"
        >
          비밀번호 입력하기
        </Button>

        {passwordResult && (
          <div className="mt-6 p-4 rounded-lg bg-[#E8EBEE]">
            <p className="text-body-05 text-[#343434] whitespace-pre-line">{passwordResult}</p>
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
