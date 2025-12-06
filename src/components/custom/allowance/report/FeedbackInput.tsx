"use client";

import React from "react";

interface FeedbackInputProps {
  label: string;               // 라벨 텍스트
  value: string;               // 입력값
  onChange: (value: string) => void; 
  onSend: () => void;          // "보내기" 버튼 클릭 핸들러
  disabled?: boolean;          // 입력/전송 비활성화 여부
  isChild?: boolean;           // 자녀 여부 (버튼 숨기기용)
  isSending?: boolean;         // 전송 중 로더 상태
  placeholder?: string;        // placeholder
}

export default function FeedbackInput({
  label,
  value,
  onChange,
  onSend,
  disabled = false,
  isChild = false,
  isSending = false,
  placeholder = "피드백을 입력하세요",
}: FeedbackInputProps) {
  return (
    <div className="mt-6 w-full">
      
      {/* Label */}
      <label className="text-body-03 text-neutral-2 mb-[8px] block">
        {label}
      </label>

      {/* Input + Button Container */}
      <div
        className="
          flex w-full h-[52px] rounded-[20px] overflow-hidden 
          shadow-[0_2px_10px_rgba(0,0,0,0.06)]
          border border-neutral-6 bg-white
        "
      >
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="
            flex-1 h-full px-4 text-body-06 outline-none 
            placeholder:text-neutral-3 bg-transparent
            disabled:text-neutral-1
          "
        />

        {/* 보낸 기록이 있거나 자녀이면 버튼 숨김 */}
        {!isChild && (
          <button
            onClick={onSend}
            disabled={disabled || isSending}
            className={`
              w-[80px] text-body-04 font-medium transition-colors
              ${(disabled || isSending)
                ? "bg-neutral-4 text-neutral-2 cursor-not-allowed"
                : "bg-primary-1 text-white hover:bg-[#2c75dd]"}
            `}
          >
            {isSending ? "보내는 중..." : "보내기"}
          </button>
        )}
      </div>
    </div>
  );
}
