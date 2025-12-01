"use client";

/**
 * 랜덤 state 문자열 생성 (CSRF 방어용)
 */
function generateRandomState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * 카카오 OAuth 인증 URL을 생성합니다.
 *
 * @returns 카카오 로그인 페이지 URL
 */
export function getKakaoAuthUrl(): string {
  // CSRF 방어를 위한 state 생성
  const state = generateRandomState();
  sessionStorage.setItem("kakao-oauth-state", state);

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
    response_type: "code",
    state: state,
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

/**
 * 카카오 로그인을 시작합니다.
 * 카카오 인증 페이지로 리다이렉트됩니다.
 */
export function startKakaoLogin(): void {
  const kakaoAuthUrl = getKakaoAuthUrl();
  window.location.href = kakaoAuthUrl;
}
