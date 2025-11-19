"use client";

import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupCompletePage() {
  const router = useRouter();
  const [role, setRole] = useState<"PARENT" | "CHILD" | null>(null);

  useEffect(() => {
    // sessionStorage에서 role 읽기
    if (globalThis.window !== undefined) {
      const savedRole = globalThis.window.sessionStorage.getItem(
        "signup-complete-role"
      ) as "PARENT" | "CHILD" | null;
      if (savedRole) {
        setRole(savedRole);
        // 사용 후 sessionStorage에서 제거
        globalThis.window.sessionStorage.removeItem("signup-complete-role");
        globalThis.window.sessionStorage.removeItem("register-form-storage");
      }
    }
  }, []);

  return (
    <main className="px-6 flex flex-col items-center">
      <div className="w-full max-w-[327px]">
        {/* 상단 여백 + 아이콘 */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="flex items-center justify-center pt-[84px] pb-[16px]">
            <Image
              src="/icons/check-primary-1.png"
              alt="check"
              width={41}
              height={40}
            />
          </div>
          <h1 className="text-head-01 text-neutral-1">가입이 완료되었어요!</h1>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="flex justify-center items-center w-full pb-[40px] pt-[16px]">
          <Image
            src="/images/auth/illust_auth_3.png"
            alt="티니피니 캐릭터"
            width={222}
            height={222}
            className="object-contain"
          />
        </div>

        {/* 설명 문구 */}
        <p className="text-head-01 text-neutral-1 text-center whitespace-pre-line">
          {"티니피니와 함께\n즐거운 금융 생활을 시작해요"}
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {role === "PARENT" ? (
          <BigButtonActivated
            label="내 계좌 불러오기"
            onClick={() => router.push("/home")}
          />
        ) : (
          <BigButtonActivated
            label="가족 등록하기"
            onClick={() => router.push("/family/info")}
          />
        )}
      </div>
    </main>
  );
}
