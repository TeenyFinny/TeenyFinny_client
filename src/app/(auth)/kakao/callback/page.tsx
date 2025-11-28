"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { saveAuthToken } from "@/lib/auth/token";
import { useUserStore } from "@/store/userStore";
import { HttpError } from "@/types/axios/httpError.t";

/**
 * 카카오 OAuth 콜백 페이지 내부 컴포넌트
 */
function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      // URL에서 code와 state 파라미터 추출
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      // 에러 처리
      if (errorParam) {
        setError("카카오 로그인이 취소되었습니다.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // CSRF 방어: state 검증
      const savedState = sessionStorage.getItem('kakao-oauth-state');
      if (!state || state !== savedState) {
        setError("잘못된 요청입니다. (CSRF 검증 실패)");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // state 사용 완료 후 삭제
      sessionStorage.removeItem('kakao-oauth-state');

      if (!code) {
        setError("인증 코드를 받지 못했습니다.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // 백엔드에 code 전송
        const response = await api.post(requests.kakaoLogin, {
          code,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        });

        const { isNewUser, user, tokenType, accessToken, tempToken, kakaoEmail, kakaoName } = response.data;

        if (isNewUser) {
          // 신규 사용자: 임시 토큰과 카카오 정보 저장 후 기존 회원가입 페이지로
          if (tempToken) {
            sessionStorage.setItem("kakao-temp-token", tempToken);
            sessionStorage.setItem("kakao-email", kakaoEmail || "");
            sessionStorage.setItem("kakao-name", kakaoName || "");
            sessionStorage.setItem("is-kakao-signup", "true"); // 카카오 회원가입 플래그
          }
          router.push("/signup"); // 기존 회원가입 페이지로 이동
        } else {
          // 기존 사용자: 토큰 저장 및 로그인 처리
          if (!user || !tokenType || !accessToken) {
            throw new HttpError({
              message: "서버 응답이 올바르지 않습니다.",
              statusCode: 500,
            });
          }

          // 토큰 저장
          saveAuthToken(tokenType, accessToken);

          // 사용자 상태 저장
          const role = user.role?.toLowerCase();
          if (role !== "parent" && role !== "child") {
            throw new HttpError({
              message: "잘못된 사용자 역할입니다.",
              statusCode: 500,
            });
          }

          setUser(
            user.name,
            role as "parent" | "child",
            user.userId,
            Array.isArray(user.children) && user.children.length > 0
          );

          // 자녀의 가족 연결 상태에 따른 hasFamily 플래그 관리
          if (role === "child") {
            if (user.familyId) {
              // 가족 연결됨 -> 플래그 제거
              sessionStorage.removeItem("hasFamily");
            } else {
              // 가족 연결 안 됨 -> 플래그 설정
              sessionStorage.setItem("hasFamily", "false");
            }
          }

          // 홈으로 이동
          router.replace("/home");
        }
      } catch (err) {
        console.error("카카오 로그인 처리 실패:", err);
        if (err instanceof HttpError) {
          setError(err.message || "로그인에 실패했습니다.");
        } else {
          setError("예기치 못한 오류가 발생했습니다.");
        }
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleKakaoCallback();
  }, [searchParams, router, setUser]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        {error ? (
          <>
            <div className="text-error text-body-04">{error}</div>
            <div className="text-body-07 text-neutral-3">
              로그인 페이지로 이동합니다...
            </div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1"></div>
            <div className="text-body-04 text-neutral-1">
              카카오 로그인 처리 중...
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/**
 * 카카오 OAuth 콜백 페이지
 * 
 * Suspense로 감싸서 useSearchParams 사용
 */
export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1"></div>
          <div className="text-body-04 text-neutral-1">
            로딩 중...
          </div>
        </div>
      </main>
    }>
      <KakaoCallbackContent />
    </Suspense>
  );
}
