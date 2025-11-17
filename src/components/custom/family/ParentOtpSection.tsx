"use client";

import OtpDisplay from "@/components/custom/family/OtpDisplay";

type Props = Readonly<{ otp: string | null }>;

/**
 * ParentOtpSection
 *
 * 부모 사용자(PARENT) 화면에서 서버로부터 발급된 가족등록 OTP를 표시하는
 * 단순 프레젠테이션 컴포넌트입니다.
 *
 * ### 주요 역할
 * - OTP 값을 OtpDisplay 컴포넌트에 전달하여 화면에 보여주는 역할만 수행
 * - 별도의 로직 처리(요청, 검증 등)는 수행하지 않음
 *
 * ### 사용 위치
 * - `/family/page.tsx`에서 부모 흐름일 때 렌더링
 *
 * @param {Object} props
 * @param {string | null} props.otp - 서버에서 발급받은 6자리 OTP (없으면 null)
 *
 * @returns {JSX.Element} OTP 표시 UI
 */
export default function ParentOtpSection({ otp }: Props) {
  return <OtpDisplay otp={otp} />;
}
