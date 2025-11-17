"use client";

import { useRouter } from "next/navigation";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import Image from "next/image";

export default function Steop08Complete() {
  const router = useRouter();

  // 버튼 클릭 시 홈으로 이동
  const handleClick = () => {
    router.push("/home");
  };

  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <div className="mt-[76px] px-[167px] text-center justify-center">
        <Image
          src="/icons/check-primary-1.png"
          alt="파란 체크 이미지"
          width={41}
          height={40}
          className="object-contain"
        />
      </div>

      {/* 부제 */}
      <div className="mt-[16px] space-y-[24px] text-center">
        <p className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"TeenyFinny 계좌 개설에\n성공했어요!"}
        </p>
      </div>

      {/* 토끼와 코인 이미지 */}
      <div className="flex justify-center mt-[23px]">
        <div className="relative">
          <Image
            src="/images/common/illust_common_1.png"
            alt="개설 성공"
            width={350}
            height={233}
            className="object-contain"
          />
        </div>
      </div>

      <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-[327px]">
        <BigButtonActivated label="개설하기" onClick={handleClick} />
      </div>
    </div>
  );
}
