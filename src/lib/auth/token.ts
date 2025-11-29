"use client";

type StoredToken = {
  tokenType: string;
  accessToken: string;
};

const TOKEN_STORAGE_KEY = "teenyfinny-auth-token";

let inMemoryToken: StoredToken | null = null;

const isBrowser = () => typeof window !== "undefined";

function persistToken(token: StoredToken | null) {
  if (!isBrowser()) return;

  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function saveAuthToken(tokenType: string, accessToken: string) {
  if (!tokenType || !accessToken) return;

  inMemoryToken = {
    tokenType,
    accessToken,
  };
  persistToken(inMemoryToken);
}

export function loadAuthToken(): StoredToken | null {
  if (inMemoryToken) return inMemoryToken;
  if (!isBrowser()) return null;

  const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;

  try {
    inMemoryToken = JSON.parse(raw) as StoredToken;
    return inMemoryToken;
  } catch (e) {
    console.warn("Failed to parse stored auth token", e);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    inMemoryToken = null;
    return null;
  }
}

export function clearAuthToken() {
  inMemoryToken = null;
  persistToken(null);
}

export function getAuthorizationHeader(): string | null {
  const token = loadAuthToken();
  if (!token?.accessToken) return null;

  const prefix = token.tokenType?.trim() || "Bearer";
  return `${prefix} ${token.accessToken}`;
}

/**
 * 토큰이 존재하는지 확인
 */
export function hasAuthToken(): boolean {
  return loadAuthToken() !== null;
}
