"use client";

import React from "react";

interface SpeechBubbleProps {
  text: string;
  /** 배경색: 'blue' | 'gray' | 'skyblue' */
  bgColor?: "blue" | "gray" | "skyblue";
  /** 글자색: 'blue' | 'gray' | 'skyblue' | 'black' */
  textColor?: "blue" | "gray" | "skyblue" | "black" | "white";
  /** 꼬리 위치: left, right, center */
  tailPosition?: "left" | "right" | "center";
}

/**
 * SpeechBubble
 *
 * Tailwind 기반 말풍선 UI 컴포넌트
 * - 기본 크기: 230 x 64
 * - Tailwind 색상 키워드로 배경색/글자색 적용
 * - 꼬리 위치 선택 가능
 */
export default function SpeechBubble({
  text,
  bgColor = "blue",
  textColor = "gray",
  tailPosition = "center",
}: SpeechBubbleProps) {
  /** Tailwind 배경색 매핑 */
  const bgClassMap: Record<string, string> = {
    blue: "bg-primary-1",
    gray: "bg-monochrome-gray",
    skyblue: "bg-primary-4",
  };

  /** Tailwind 글자색 매핑 */
  const textClassMap: Record<string, string> = {
    blue: "text-primary-1",
    gray: "text-neutral-1",
    skyblue: "text-primary-4",
    black: "text-black",
    white: "text-white",
  };

  /** 꼬리 위치 클래스 */
  let tailPosClass = "absolute bottom-[-8px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent";
  if (tailPosition === "center") {
    tailPosClass += " left-1/2 -translate-x-1/2";
  } else if (tailPosition === "left") {
    tailPosClass += " left-[16px]";
  } else if (tailPosition === "right") {
    tailPosClass += " right-[16px]";
  }

  /** Tailwind 꼬리 색 클래스 */
  const tailColorClassMap: Record<string, string> = {
    blue: "border-t-primary-1",
    gray: "border-t-monochrome-gray",
    skyblue: "border-t-primary-4",
  };

  return (
    <div className={`relative flex items-center justify-center w-[230px] h-[64px] rounded-[16px] px-4 text-center ${bgClassMap[bgColor]}`}>
      <p className={`text-body-04 font-medium ${textClassMap[textColor]}`}>{text}</p>

      {/* 꼬리 */}
      <div className={`${tailPosClass} ${tailColorClassMap[bgColor]} border-t-[9px]`} />
    </div>
  );
}
