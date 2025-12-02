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
  // ⛔ 서버에서 불리면 안 됨
  if (typeof window === "undefined") {
    throw new Error("getKakaoAuthUrl는 브라우저 환경에서만 호출해야 합니다.");
  }

  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Kakao OAuth 환경변수가 설정되지 않았습니다.");
  }

  // CSRF 방어용 state
  const state = generateRandomState();
  window.sessionStorage.setItem("kakao-oauth-state", state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
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
