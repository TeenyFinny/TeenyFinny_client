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
 * 현재 환경에 맞는 카카오 Redirect URI를 반환합니다.
 *
 * @returns 카카오 Redirect URI
 */
export function getKakaoRedirectUri(): string {
  // 클라이언트 사이드에서는 window.location.origin을 사용해 동적으로 URI 생성
  if (typeof window !== "undefined") {
    return `${window.location.origin}/kakao/callback`;
  }

  // 서버 사이드 또는 폴백으로 환경 변수 사용
  return (
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
    "http://localhost:3000/kakao/callback"
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

  const redirectUri = getKakaoRedirectUri();

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
    redirect_uri: redirectUri,
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
