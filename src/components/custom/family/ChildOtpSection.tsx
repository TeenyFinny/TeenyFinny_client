"use client";

import OtpInput from "@/components/custom/family/OtpInput";

type Props = Readonly<{
  value: string;
  onChange: (v: string) => void;
  error: boolean;
  disabled?: boolean;
}>;

/**
 * ChildOtpSection
 *
 * 자녀 사용자(CHILD) 화면에서 **부모로부터 받은 가족등록 OTP를 입력하는 UI를 렌더링하는**
 * 프레젠테이션 컴포넌트입니다.
 *
 * ### 주요 역할
 * - OTP 입력 UI(OtpInput)에 필요한 제어형 상태(value, onChange, error)를 전달
 * - 자체적으로 비즈니스 로직(검증, API 호출 등)은 수행하지 않음
 *
 * ### 사용 위치
 * - `/family/page.tsx`에서 자녀 흐름일 때 렌더링
 *
 * @param {Object} props
 * @param {string} props.value - 현재 입력된 OTP 값(제어형 상태)
 * @param {(v: string) => void} props.onChange - OTP 입력 변경 핸들러
 * @param {boolean} props.error - 입력 오류 여부 (에러 스타일 적용 여부)
 * @param {boolean} props.disabled - 비활성화 여부
 *
 * @returns {JSX.Element} OTP 입력 UI
 */
export default function ChildOtpSection({
  value,
  onChange,
  error,
  disabled,
}: Props) {
  return (
    <OtpInput
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
    />
  );
}
