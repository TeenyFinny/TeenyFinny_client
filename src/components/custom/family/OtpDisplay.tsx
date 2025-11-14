"use client";

/**
 * OtpDisplay
 *
 * 6자리 OTP를 개별 박스로 표시하는 컴포넌트입니다.
 *
 * @param otp - 표시할 6자리 OTP 문자열 (예: "123123")
 */
type OtpDisplayProps = Readonly<{
  otp: string | null;
}>;

export default function OtpDisplay({ otp }: OtpDisplayProps) {
  // OTP를 6자리로 맞추기 (없으면 빈 문자열, 있으면 앞 6자리만)
  const otpDigits = otp ? otp.slice(0, 6).padEnd(6, "0") : "000000";

  // 고정된 박스 위치 배열 (인덱스 대신 사용)
  const boxPositions = [0, 1, 2, 3, 4, 5];

  return (
    <div className="flex justify-center items-center gap-[12px] mt-[4px] pb-[182px]">
      {boxPositions.map((position) => {
        const digit = otpDigits[position] || "0";
        return (
          <div
            key={`otp-box-${position}`}
            className="w-[37px] h-[70px] rounded-[10px] bg-monochrome-lightgray border border-monochrome-gray flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)]"
          >
            <span className="text-head-00 text-neutral-1">{digit}</span>
          </div>
        );
      })}
    </div>
  );
}
