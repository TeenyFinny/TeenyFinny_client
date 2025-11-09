// src/lib/utils/userMapper.ts
import type { AxiosRequestConfig } from "axios";
import requests from "@/lib/axios/requests";
import api from "@/lib/axios/axios";
import { useUserStore } from "@/store/userStore";
import type { ApiResponse } from "@/types/axios/apiRes.t";

/**
 * @typedef ChildSummary
 * @description 부모 계정의 자녀 계좌 요약 정보를 나타냅니다.
 * @property {number} id - 자녀 계좌 고유 식별자.
 * @property {string} name - 자녀 이름.
 * @property {number} balance - 자녀 계좌 잔액.
 */
export interface ChildSummary {
  id: number;
  name: string;
  balance: number;
}

/**
 * @typedef MappedUser
 * @description API 응답을 프론트엔드 상태에서 활용하기 위한 사용자 정보입니다.
 */
export interface MappedUser {
  userName: string;
  userType: "parent" | "child" | null;
  hasChildren: boolean;
  email?: string;
  balance: number;
  children: ChildSummary[];
}

/**
 * 역할 문자열을 enum 형태로 정규화합니다.
 */
const normalizeRole = (role: unknown): MappedUser["userType"] => {
  if (typeof role !== "string") return null;
  const lowered = role.toLowerCase();
  return lowered === "parent" || lowered === "child" ? lowered : null;
};

/**
 * 사용자 응답에서 자녀 계좌 목록을 추출합니다.
 */
const extractChildren = (payload: any): ChildSummary[] => {
  if (!payload || !Array.isArray(payload.children)) return [];
  return payload.children.map((child: any) => ({
    id: Number(child.id ?? 0),
    name: child.name ?? "",
    balance: Number(child.balance ?? 0),
  }));
};

/**
 * 백엔드 사용자 응답(ApiResponse.data)을 `MappedUser` 구조로 변환합니다.
 */
export const mapUserFromApi = (
  response: ApiResponse<{ user: Record<string, any> }>
): MappedUser => {
  const userPayload = response.data?.user ?? {};
  const role = normalizeRole(userPayload.role);
  const children = extractChildren(userPayload);

  return {
    userName: userPayload.name ?? "",
    userType: role,
    hasChildren: children.length > 0,
    email: userPayload.email ?? "",
    balance: Number(userPayload.balance ?? 0),
    children: role === "parent" ? children : [],
  };
};

/**
 * snake_case → camelCase 변환 (axios 응답용)
 */
export const toCamelCaseKeys = (obj: Record<string, any>): any => {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCaseKeys);

  return Object.entries(obj).reduce((acc, [key, val]) => {
    const camelKey = key.replaceAll(/_([a-z])/g, (_, c) => c.toUpperCase());
    acc[camelKey] =
      typeof val === "object" && val !== null ? toCamelCaseKeys(val) : val;
    return acc;
  }, {} as Record<string, any>);
};

/**
 * 서버에서 받은 응답 데이터를 camelCase로 변환합니다.
 */
export const mapAxiosResponse = <T = any>(payload: T): T => {
  if (!payload) return {} as T;
  return toCamelCaseKeys(payload);
};

/**
 * `/home` 엔드포인트를 호출해 사용자 정보를 받아오고 Zustand에 반영합니다.
 */
export const fetchAndSetUser = async (
  url: string = requests.fetchHome,
  options?: AxiosRequestConfig
): Promise<MappedUser> => {
  // 1. ApiResponse<{ user: ... }> 제네릭 명시
  const res = await api.get<ApiResponse<{ user: Record<string, any> }>>(url, options);

  // 2. res.data만 camelCase로 변환
  const camelData = mapAxiosResponse(res.data);

  // 3. 변환된 데이터를 mapUserFromApi로 전달
  const mapped = mapUserFromApi(camelData);

  // 4. Zustand 상태 반영
  useUserStore
    .getState()
    .setUser(mapped.userName, mapped.userType, mapped.hasChildren);

  return mapped;
};
