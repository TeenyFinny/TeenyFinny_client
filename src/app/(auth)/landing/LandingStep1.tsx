"use client";

import SpeechBubble from "@/components/custom/landing/SpeechBubble";
import React from "react";
import Image from "next/image";

/**
 * LandingStep1
 * 
 * 아이 금융 교육 소개 문구 페이지
 * - 상단 여백: 36px
 * - 중앙 정렬
 * - "티니피니" 텍스트만 primary-1 색상 적용
 */
export default function LandingStep1() {
  return (
    <div className="flex flex-col items-center w-[375px] mt-[36px] text-center">
  {/* 윗부분 텍스트 */}
  <p className="text-head-03 font-bold text-[var(--color-neutral-1)]">
    아이 금융 교육 막막하셨나요?
  </p>

  {/* 아랫부분 텍스트 */}
  <p className="text-head-00 font-bold text-[var(--color-neutral-1)]">
    <span className="text-[var(--color-primary-1)]">티니피니</span>가 대신 알려줄게요
  </p>

  {/* 말풍선 1 */}
  <div className="self-start ml-[53px] mt-[25px]">
    <SpeechBubble
      text="엄마 주식이 뭐에요?"
      bgColor="var(--color-monochrome-gray)"
      textColor="black"
      tailPosition="right"
    />
  </div>

  {/* 이미지 1 */}
  <div className="self-start ml-[220px] mt-[17px]">
    <Image
      src="/images/common/illust_common_girl_118X118.png"
      alt="아이"
      width={118}
      height={118}
      priority
    />
  </div>

  {/* 말풍선 2 */}
  <div className="self-start ml-[103px] mt-[17px]">
    <SpeechBubble
      text="어디서부터 설명을 해 줘야 하지..."
      bgColor="var(--color-primary-1)"
      textColor="var(--color-primary-4)"
      tailPosition="left"
    />
  </div>

  {/* 이미지 2 */}
  <div className="self-start ml-[39px] mt-[17px]">
    <Image
      src="/images/common/illust_common_mom.png"
      alt="부모"
      width={118}
      height={118}
      priority
    />
  </div>
</div>


  );
}
