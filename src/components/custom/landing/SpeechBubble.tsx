"use client";

import React from "react";

interface SpeechBubbleProps {
  text: string;
  bgColor?: string;
  textColor?: string;
}

/**
 * SpeechBubble
 *
 * 말풍선 형태의 UI 컴포넌트
 * - 기본 크기: 230 x 64
 * - 배경색, 텍스트 색, 텍스트 내용 커스터마이징 가능
 */
export default function SpeechBubble({
  text,
  bgColor = "var(--color-primary-4)",
  textColor = "var(--color-neutral-1)",
}: SpeechBubbleProps) {
  return (
    <div
      className="relative flex items-center justify-center w-[230px] h-[64px] rounded-[16px] px-4 text-center"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <p className="text-body-04 font-medium">{text}</p>

      {/* 꼬리 부분 */}
      <div
        className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `8px solid ${bgColor}`,
        }}
      />
    </div>
  );
}
