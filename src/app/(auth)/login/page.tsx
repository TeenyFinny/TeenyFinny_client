// app/(no-footer)/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlexibleInputField } from "@/components/ui/input/FlexibleInputField";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim().length === 0) {
      setEmailError(null);
      return;
    }
    setEmailError(
      EMAIL_REGEX.test(value) ? null : "유효한 이메일 형식이 아닙니다."
    );
  };

  const handleKakaoLogin = () => {
    router.push("/signup");
  };

  return (
    <main className="min-h-[calc(100dvh-44px)]">
      <div className="mx-auto flex w-full flex-col px-6 pb-12 pt-29.5">
        <div className="flex justify-center">
          <Image
            src="/logos/48x48.png"
            alt="티니피니 로고"
            width={48}
            height={48}
            priority
          />
        </div>

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
          {emailError && (
            <p className="text-body-08 text-(--color-error)">{emailError}</p>
          )}
          <FlexibleInputField
            label="비밀번호를 입력하세요"
            enabled
            text={password}
            setText={setPassword}
            placeholder="비밀번호를 입력하세요"
            type="password"
            inputSize="lg"
          />
        </div>

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
