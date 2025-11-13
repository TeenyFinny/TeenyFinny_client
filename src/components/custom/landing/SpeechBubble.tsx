"use client";

import React from "react";

interface SpeechBubbleProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  /** 꼬리 위치: left 또는 right. 기본은 center */
  tailPosition?: "left" | "right" | "center";
}

/**
 * SpeechBubble
 *
 * 말풍선 형태의 UI 컴포넌트
 * - 기본 크기: 230 x 64
 * - 배경색, 텍스트 색, 텍스트 내용 커스터마이징 가능
 * - 꼬리 위치: 왼쪽, 오른쪽, 중앙 가능
 */
export default function SpeechBubble({
  text,
  bgColor = "var(--color-primary-4)",
  textColor = "var(--color-neutral-1)",
  tailPosition = "center",
}: SpeechBubbleProps) {
  /** 꼬리 위치에 따른 클래스 계산 */
  let tailClass = "absolute bottom-[-8px] w-0 h-0";
  if (tailPosition === "center") {
    tailClass += " left-1/2 -translate-x-1/2";
  } else if (tailPosition === "left") {
    tailClass += " left-[16px] translate-x-0";
  } else if (tailPosition === "right") {
    tailClass += " right-[16px] translate-x-0";
  }

  return (
    <div
      className="relative flex items-center justify-center w-[230px] h-[64px] rounded-[16px] px-4 text-center"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <p className="text-body-04 font-medium">{text}</p>

      {/* 꼬리 */}
      <div
        className={tailClass}
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `9px solid ${bgColor}`,
        }}
      />
    </div>
  );
}
