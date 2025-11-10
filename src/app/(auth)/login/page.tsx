// app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginForm } from "./useLoginForm";
import { FlexibleInputField } from "@/components/ui/input/FlexibleInputField";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";

export default function Page() {
  const router = useRouter();
  const {
    email,
    password,
    error,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLoginForm();

  const handleKakaoLogin = () => {
    router.push("/signup");
  };

  return (
    <main className="min-h-[calc(100dvh-44px)]">
      <div className="mx-auto flex w-full flex-col px-6 pb-12 pt-29.5">
        {/* 로고 */}
        <div className="flex justify-center">
          <Image
            src="/logos/48x48.png"
            alt="티니피니 로고"
            width={48}
            height={48}
            priority
          />
        </div>

        {/* 입력 영역 */}
        <div className="pt-21.5 flex flex-col gap-6">
          <FlexibleInputField
            label="이메일을 입력하세요"
            enabled
            text={email}
            setText={handleEmailChange}
            placeholder="이메일을 입력하세요"
            type="email"
            inputSize="lg"
          />

          <FlexibleInputField
            label="비밀번호를 입력하세요"
            enabled
            text={password}
            setText={handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
            type="password"
            inputSize="lg"
          />
        </div>

        {/* 에러 메시지 */}
        {error && <p className="pt-4 text-body-08 text-error">{error}</p>}

        {/* 로그인 버튼 */}
        <div className="pt-8.5 flex justify-center">
          <BigButtonActivated
            label={isSubmitting ? "로그인 중..." : "로그인"}
            onClick={handleSubmit}
          />
        </div>

        {/* 카카오 로그인 */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="pt-8.5 flex justify-center"
        >
          <Image
            src="/images/auth/kakao_login_medium_wide.png"
            alt="카카오 로그인"
            width={300}
            height={45}
            priority
          />
        </button>

        {/* 회원가입 이동 */}
        <Link
          href="/signup"
          className="pt-8.5 text-center text-body-07 text-neutral-3 underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </div>
    </main>
  );
}
