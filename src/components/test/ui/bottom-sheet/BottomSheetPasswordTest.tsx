"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword"

export default function Home() {
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false)
  const [passwordType, setPasswordType] = useState<"4digit" | "6digit">("6digit")
  const [passwordResult, setPasswordResult] = useState<string>("")

  const handlePasswordComplete = (password: string) => {
    const type = passwordType === "4digit" ? "4자리" : "6자리"
    setPasswordResult(`${type} 비밀번호: ${password}`)
    setIsPasswordSheetOpen(false)
  }

  const open4DigitSheet = () => {
    setPasswordType("4digit")
    setIsPasswordSheetOpen(true)
  }

  const open6DigitSheet = () => {
    setPasswordType("6digit")
    setIsPasswordSheetOpen(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-monochrome-lightgray p-[32px]">
      <div className="text-center space-y-[24px] max-w-[480px] w-full">
        <div className="space-y-[8px]">
          <h1 className="text-head-01 text-neutral-1">간편 비밀번호 바텀시트 테스트</h1>
          <p className="text-body-05 text-neutral-2">
            버튼을 클릭하여 4자리 또는 6자리 비밀번호 입력을 테스트해보세요
          </p>
        </div>

        <div className="flex flex-col gap-[16px]">
          <Button
            onClick={open4DigitSheet}
            className="bg-primary-1 hover:bg-[#005a94] text-neutral-7 px-[32px] py-[24px] text-body-04 w-full"
          >
            4자리 결제 비밀번호 입력
          </Button>

          <Button
            onClick={open6DigitSheet}
            className="bg-primary-1 hover:bg-[#005a94] text-neutral-7 px-[32px] py-[24px] text-body-04 w-full"
          >
            6자리 간편 비밀번호 입력
          </Button>
        </div>

        {passwordResult && (
          <div className="mt-[24px] p-[16px] rounded-lg bg-monochrome-gray">
            <p className="text-body-05 text-neutral-1 whitespace-pre-line">{passwordResult}</p>
          </div>
        )}

        <BottomSheetPassword
          open={isPasswordSheetOpen}
          setOpen={setIsPasswordSheetOpen}
          pinLength={passwordType === "4digit" ? 4 : 6}
          title={passwordType === "4digit" ? "결제 비밀번호" : "간편비밀번호"}
          onComplete={handlePasswordComplete}
        />
      </div>
    </main>
  )
}