"use client";

import { useState, useRef, useEffect } from "react";

/**
 * OtpInput
 *
 * 6자리 OTP를 입력할 수 있는 컴포넌트입니다.
 * 각 자리수마다 개별 입력 필드를 제공합니다.
 *
 * @param value - 현재 입력된 OTP 값
 * @param onChange - OTP 값이 변경될 때 호출되는 콜백
 * @param error - 에러 상태 (true일 경우 입력 필드에 에러 스타일 적용)
 * @param disabled - 비활성화 상태 (true일 경우 입력 불가)
 */
type OtpInputProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}>;

export default function OtpInput({
  value,
  onChange,
  error = false,
  disabled = false,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // value prop이 변경되면 내부 상태 동기화
  useEffect(() => {
    const newDigits = value
      .slice(0, 6)
      .split("")
      .concat(Array(6 - Math.min(value.length, 6)).fill(""));
    setDigits(newDigits);
  }, [value]);

  /**
   * 특정 인덱스의 숫자를 업데이트하고 다음 입력 필드로 포커스 이동
   */
  const handleChange = (index: number, newValue: string) => {
    // 비활성화 상태면 입력 불가
    if (disabled) return;

    // 숫자만 허용
    if (newValue && !/^\d$/.test(newValue)) return;

    const newDigits = [...digits];
    newDigits[index] = newValue;
    setDigits(newDigits);

    // 전체 OTP 값 업데이트
    const otpValue = newDigits.join("");
    onChange(otpValue);

    // 다음 입력 필드로 포커스 이동
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * 백스페이스 키 처리
   */
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      // 현재 필드가 비어있으면 이전 필드로 이동
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * 붙여넣기 처리
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // 비활성화 상태면 붙여넣기 불가
    if (disabled) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pastedDigits = pastedData
      .split("")
      .filter((char) => /^\d$/.test(char))
      .slice(0, 6);

    if (pastedDigits.length > 0) {
      const newDigits = [
        ...pastedDigits,
        ...Array(6 - pastedDigits.length).fill(""),
      ];
      setDigits(newDigits);
      onChange(newDigits.join(""));

      // 마지막 입력된 필드로 포커스 이동
      const focusIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center gap-[12px] mt-[4px]">
      {digits.map((digit, index) => (
        <input
          key={`otp-input-${index}`}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-[37px] h-[70px] rounded-[10px] bg-monochrome-lightgray border ${
            error ? "border-error" : "border-monochrome-gray"
          } flex items-center justify-center text-center text-head-00 text-neutral-1 focus:outline-none focus:ring-2 focus:ring-primary-1 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={`OTP ${index + 1}번째 자리`}
        />
      ))}
    </div>
  );
}
