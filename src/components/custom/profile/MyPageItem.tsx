// components/custom/mypage/MyPageItem.tsx
"use client";

import Image from "next/image";

type MyPageItemProps = Readonly<{
  label: string;
  onClick?: () => void;
}>;

export default function MyPageItem({ label, onClick }: MyPageItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-[12px] h-[80px] px-[20px] flex items-center justify-between shadow-[0px_16px_64px_-32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/images/profile/illust_profile_setting.png"
          alt="설정"
          width={48}
          height={48}
        />
        <span className="text-head-08 whitespace-pre-line">{label}</span>
      </div>

      <Image
        src="/icons/arrow-right.png"
        alt={`페이지 이동 아이콘`}
        width={24}
        height={24}
        style={{
          filter:
            "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
        }}
      />
    </button>
  );
}
