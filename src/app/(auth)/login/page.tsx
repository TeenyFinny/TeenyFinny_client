// app/(auth)/login/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useLoginForm } from "./useLoginForm"
import { FlexibleInputField } from "@/components/ui/input/FlexibleInputField"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { startKakaoLogin } from "@/lib/auth/kakaoAuth"

export default function Page() {
  const { email, password, error, isSubmitting, handleEmailChange, handlePasswordChange, handleSubmit } = useLoginForm()

  const handleKakaoLogin = () => {
    startKakaoLogin()
  }

  return (
    <main className="min-h-[calc(100dvh-44px)]">
      <div className="mx-auto flex w-full flex-col px-6 pb-20 pt-20">
        {/* 로고 */}
        <div className="flex justify-center">
          <Image src="/logos/96x96.png" alt="티니피니 로고" width={96} height={96} priority />
        </div>

        {/* 입력 영역 */}
        <div className="pt-20 flex flex-col gap-6">
          <FlexibleInputField label="이메일을 입력하세요" enabled text={email} setText={handleEmailChange} placeholder="이메일을 입력하세요" type="email" inputSize="lg" />

          <FlexibleInputField label="비밀번호를 입력하세요" enabled text={password} setText={handlePasswordChange} placeholder="비밀번호를 입력하세요" type="password" inputSize="lg" />
        </div>

        {/* 에러 메시지 */}
        {error && <p className="pl-4 text-body-08 text-error">{error}</p>}

        {/* 로그인 버튼 */}
        <div className="pt-8.5 flex justify-center">
          <BigButtonActivated label={isSubmitting ? "로그인 중..." : "로그인"} onClick={handleSubmit} />
        </div>

        {/* 카카오 로그인 */}
        <div className="pt-8.5 flex justify-center">
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="
              relative flex items-center justify-center
              w-[327px] h-[56px] p-0
              rounded-[15px]
              overflow-hidden
            "
          >
            <Image src="/images/auth/kakao_login_medium_wide.png" alt="카카오 로그인" width={327} height={56} className="object-cover" priority />
          </button>
        </div>

        {/* 회원가입 / ID/PW 찾기 */}
        <div className="pt-8.5 flex items-center justify-center gap-2">
          <Link href="/signup" className="text-body-07 text-neutral-3 underline-offset-4 hover:underline">
            회원가입
          </Link>
          <span className="text-body-07 text-neutral-3">|</span>
          <Link href="/find" className="text-body-07 text-neutral-3 underline-offset-4 hover:underline">
            ID/PW 찾기
          </Link>
        </div>
      </div>
    </main>
  )
}
