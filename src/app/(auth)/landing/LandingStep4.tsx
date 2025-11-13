"use client";

import React from "react";
import Image from "next/image";

/**
 * LandingStep4
 * 
 * 아이 금융 교육 소개 문구 페이지
 * - 상단 여백: 112px
 * - 중앙 정렬
 * - 특정 텍스트만 primary-1 색상 적용
 * - 중앙 이미지 포함
 */
export default function LandingStep4() {
  return (
    <div className="relative w-full flex flex-col items-center mt-[112px] text-center">
      <p className="text-center">
        <span className="text-landing-01 font-bold text-[var(--color-neutral-1)]">모두가 </span>
        <br />
        <span className="text-landing-01 font-bold text-[var(--color-primary-1)]">워렌버핏</span>
        <span className="text-landing-01 font-bold text-[var(--color-neutral-1)]">이 </span>
        <br />
        <span className="text-landing-01 font-bold text-[var(--color-neutral-1)]">되는 세상</span>
      </p>

      {/* 중앙 이미지 */}
      <div className="absolute top-[72px] w-[233px] h-[350px]">
        <Image
          src="/images/common/illust_common_bigcoin.png"
          alt="큰코인"
          width={233}
          height={350}
          priority
        />
      </div>
    </div>
  );
}
