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
    <div className="flex flex-col items-center mt-[36px] text-center">
      {/* 윗부분 텍스트 */}
      <p className="text-head-03 font-bold text-[var(--color-neutral-1)]">
        아이 금융 교육 막막하셨나요?
      </p>

      {/* 아랫부분 텍스트 */}
      <p className="text-head-00 font-bold text-[var(--color-neutral-1)]">
        <span className="text-[var(--color-primary-1)]">티니피니</span>가 대신 알려줄게요
      </p>

      {/* 말풍선 1 */}
      <div className="mt-[25px]">
        <SpeechBubble
          text="엄마 주식이 뭐에요?"
          bgColor="var(--color-monochrome-gray)"
          textColor="black"
        />
      </div>


      {/* 이미지 1: 텍스트와 15px 간격 */}
      <div className="mt-[15px]">
        <Image
          src="/images/common/illust_common_girl_118X118.png"
          alt="아이"
          width={118}
          height={118}
          priority
        />
      </div>

      {/* 말풍선 2 */}
      <div className="mt-[15px]">
        <SpeechBubble
          text="어디서부터 설명을 해 줘야 하지..."
          bgColor="var(--color-primary-1)"
          textColor="var(--color-primary-4)"
        />
      </div>

      {/* 이미지 2: 이미지1과 15px 간격 */}
      <div className="mt-[15px]">
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
