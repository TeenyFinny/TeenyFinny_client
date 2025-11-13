"use client";

import React from "react";

import Image from "next/image";
/**
 * LandingStep2
 * 
 * 아이 금융 교육 소개 문구 페이지
 * - 상단 여백: 36px
 * - 중앙 정렬
 * - 특정 텍스트만 primary-1 색상 적용
 */
export default function LandingStep2() {
    return (
        <div className="flex flex-col items-center mt-[36px] text-center">
            <p className="text-[var(--color-neutral-1)] text-head-03 font-bold">스스로 목표를 정해</p>
            <p className="text-[var(--color-neutral-1)] text-head-00 font-bold">
                <span className="text-[var(--color-primary-1)]">올바른 소비 습관을 형성</span>해요
            </p>
            {/* 이미지 1: 텍스트와 15px 간격 */}
            <div className="mt-[15px]">
                <Image
                    src="/images/common/illust_common_portfolio.png"
                    alt="포트폴리오"
                    width={246}
                    height={246}
                    priority
                />
            </div>

            {/* 이미지 2: 이미지1과 15px 간격 */}
            <div className="mt-[15px]">
                <Image
                    src="/images/common/illust_common_girl.png"
                    alt="아이"
                    width={160}
                    height={160}
                    priority
                />
            </div>

        </div >


    );
}
