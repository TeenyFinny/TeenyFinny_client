"use client"

import { useState } from "react"
import { NormalInput } from "@/components/ui/input/NormalInput" 
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { PasswordInput } from "@/components/ui/input/PasswordInput";

export default function InputTest() {
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-[#fafcff] p-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-head-02 text-[#343434] mb-10 mt-20">테스트1</h1>
        <NormalInput label="텍스트를 입력하세요" placeholder="플레이스 홀더입니다." value={text} onChange={setText} />

        <div className="rounded-lg border border-[#e0e0e0] bg-[#ffffff] p-4">
          <p className="text-body-05 text-[#898989] mb-2">입력된 텍스트:</p>
          <p className="text-body-06 text-[#343434] whitespace-pre-line">{text || "(입력된 내용이 없습니다)"}</p>
        </div>
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-head-02 text-[#343434] mb-10 mt-20">테스트2</h1>

        <NormalInput2 label="Label" value={text2} placeholder="플레이스 홀더입니다." onChange={setText2} />

        <div className="rounded-lg bg-[#ffffff] border border-[#e0e0e0] p-4">
          <p className="text-body-07 text-[#989898] mb-2">현재 입력된 값:</p>
          <p className="text-body-06 text-[#343434] break-words">{text2 || "(비어있음)"}</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-8">
        {/** title */}
        <h1 className="text-head-02 text-[#343434] mb-10 mt-20">테스트3</h1>

        {/** password input component */}
        <PasswordInput value={password} onChange={setPassword} label="Password" placeholder="비밀번호를 입력하세요" />

        {/** display current value for testing */}
        <div className="mt-8 p-4 bg-[#f7f9a7] rounded-lg">
          <p className="text-body-07 text-[#363d4e]">
            <span className="font-semibold">입력된 비밀번호:</span> {password || "(없음)"}
          </p>
        </div>
      </div>
    </div>
  )
}
