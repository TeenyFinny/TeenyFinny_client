"use client";

import React from "react";
import Image from "next/image";

/**
 * LandingStep3
 * 
 * 아이 금융 교육 소개 문구 페이지
 * - 상단 여백: 36px
 * - 중앙 정렬
 * - 특정 텍스트만 primary-1 색상 적용
 * - 텍스트 아래에 4개의 이미지 배치
 */
export default function LandingStep3() {
  return (
    <div className="flex flex-col items-center mt-[36px] text-center">
      {/* 텍스트 */}
      <p className="text-center">
        <span className="text-head-00 font-bold text-primary-1">한 번의 송금</span>
        <span className="text-head-03 font-bold text-neutral-1">으로</span>
        <br />
        <span className="text-head-03 font-bold text-neutral-1">용돈과 투자금을 자동 분리해요</span>
      </p>

      {/* 이미지 1: 텍스트와 35px 간격 */}
      <div className="mt-[35px]">
        <Image
          src="/images/common/illust_common_smallcoin.png"
          alt="작은코인"
          width={116}
          height={116}
          priority
        />
      </div>

      {/* 이미지 2: 이미지1과 35px 간격 */}
      <div className="mt-[35px]">
        <Image
          src="/images/common/illust_common_ratio.png"
          alt="비율"
          width={314}
          height={60}
          priority
        />
      </div>

      {/* 이미지 3, 4 좌우 배치: 이미지2와 35px 간격 */}
      <div className="flex gap-[82px] mt-[35px]">
        <Image
          src="/images/common/illust_common_account1.png"
          alt="투자통장"
          width={116}
          height={123}
          priority
        />
        <Image
          src="/images/common/illust_common_account2.png"
          alt="용돈통장"
          width={116}
          height={123}
          priority
        />
      </div>
    </div>
  );
}
