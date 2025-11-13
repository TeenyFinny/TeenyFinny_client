"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OtpDisplay from "@/components/custom/family/OtpDisplay";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { HttpError } from "@/types/axios/httpError.t";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";

interface OtpResponse {
  familyOtp: number;
}

export default function FamilyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRequestingRef = useRef(false); // 중복 요청 방지를 위한 ref

  /**
   * OTP를 서버에서 가져오는 함수
   * 중복 요청 방지를 위해 로딩 중일 때는 요청하지 않음
   */
  const fetchOtp = useCallback(async () => {
    // 이미 요청 중이면 요청하지 않음
    if (isRequestingRef.current) return;

    isRequestingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get<OtpResponse>(requests.fetchFamilyOtp);
      const otpValue = res.data?.familyOtp;

      if (otpValue) {
        setOtp(otpValue.toString());
      } else {
        setOtp(null); // OTP가 없으면 초기화
        setError("OTP를 받아오지 못했습니다.");
      }
    } catch (err) {
      setOtp(null); // 요청 실패 시 OTP 초기화
      if (err instanceof HttpError) {
        setError(err.message || "OTP 요청에 실패했습니다.");
      } else {
        setError("예기치 못한 오류가 발생했습니다.");
      }
      if (process.env.NODE_ENV === "development") {
        console.error("OTP 요청 실패:", err);
      }
    } finally {
      setIsLoading(false);
      isRequestingRef.current = false;
    }
  }, []);

  /**
   * 컴포넌트 마운트 시 OTP 가져오기
   */
  useEffect(() => {
    fetchOtp();
  }, []);

  /**
   * 새로고침 버튼 클릭 핸들러
   */
  const handleRefresh = () => {
    fetchOtp();
  };

  /**
   * 확인 버튼 클릭 핸들러
   */
  const handleConfirm = () => {
    router.push("/home");
  };

  return (
    <main className="px-6 overflow-y-auto">
      {/* 타이틀 */}
      <div className="flex flex-col">
        <div className="pt-[36px] pb-[10px] text-left flex items-center">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            가족 등록
          </h1>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="ml-[5px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="새로고침"
          >
            <Image
              src="/icons/refresh.png"
              alt="refresh_icon"
              width={24}
              height={24}
              className={isLoading ? "animate-spin" : ""}
            />
          </button>
        </div>
        <div className="text-left pb-[140px]">
          <p className="text-body-06 text-neutral-3 whitespace-pre-line">
            {`자녀 계정에서 아래 인증 번호를 입력해주세요.`}
          </p>
        </div>
      </div>

      {/* 에러 메시지 - 고정 높이로 레이아웃 이동 방지 */}
      <div className="h-[32px] flex items-center justify-center">
        {error && <p className="text-body-08 text-error">{error}</p>}
      </div>

      {/* OTP 표시 */}
      <OtpDisplay otp={otp} />

      {/* 하단 확인인 버튼 */}
      <div className="max-w-[327px]">
        <BigButtonActivated label="확인" onClick={handleConfirm} />
      </div>
    </main>
  );
}
