"use client";

import Image from "next/image";

export default function AboutBanner() {
  return (
    <button
      onClick={() => console.log(`Navigate to landing page`)}
      className="h-[76px] bg-primary-2 rounded-2xl pl-[44px] pr-[45px] flex items-center justify-between hover:opacity-90 transition-opacity"
    >
      <span className="text-head-05 text-neutral-7 font-semibold whitespace-nowrap">
        티니피니 알아보기
      </span>
      <Image
        src="/logos/48x48.png"
        alt="티니피니 로고"
        width={48}
        height={34}
        className="object-contain"
      />
    </button>
  );
}
