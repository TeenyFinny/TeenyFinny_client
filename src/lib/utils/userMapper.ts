// src/lib/utils/userMapper.ts
import type { AxiosResponse } from "axios";
import requests from "@/lib/axios/requests";
import api from "@/lib/axios/axios";
import { useUserStore } from "@/store/userStore";

/**
 * @typedef ChildSummary
 * @description 부모 계정의 자녀 계좌 요약 정보를 나타냅니다.
 * @property {number} id - 자녀 계좌 고유 식별자.
 * @property {string} name - 자녀 이름.
 * @property {number} balance - 자녀 계좌 잔액.
 * @property {string} avatar - 자녀 계좌 아바타 (추가필요)
 */
export interface ChildSummary {
  id: number;
  name: string;
  balance: number;
}

/**
 * @typedef MappedUser
 * @description API 응답을 프론트엔드 상태에서 활용하기 위한 사용자 정보입니다.
 * @property {string} userName - 사용자 이름.
 * @property {"parent" | "child" | null} userType - 사용자 유형.
 * @property {boolean} hasChildren - 자녀 계좌 존재 여부.
 * @property {string} [email] - 이메일 주소.
 * @property {number} balance - 사용자 계좌 잔액.
 * @property {ChildSummary[]} children - 연결된 자녀 계좌 목록.
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
 *
 * @param {unknown} role - 서버 응답에서 내려온 역할 값.
 * @returns {"parent" | "child" | null} 정규화된 역할.
 */
const normalizeRole = (role: unknown): MappedUser["userType"] => {
  if (typeof role !== "string") return null;
  const lowered = role.toLowerCase();
  if (lowered === "parent" || lowered === "child") {
    return lowered;
  }
  return null;
};

/**
 * 사용자 응답에서 자녀 계좌 목록을 추출합니다.
 *
 * @param {any} payload - 서버에서 내려온 사용자 데이터.
 * @returns {ChildSummary[]} 변환된 자녀 계좌 목록.
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
 * 백엔드 사용자 응답을 `MappedUser` 구조로 변환합니다.
 *
 * @param {any} data - 서버에서 내려온 사용자 응답.
 * @returns {MappedUser} 변환된 사용자 데이터.
 */
export const mapUserFromDB = (data: any): MappedUser => {
  const userPayload = data?.user ?? data?.data?.user ?? data ?? {};
  const role = normalizeRole(userPayload.role);
  const children = extractChildren(userPayload);

  const hasChildren = children.length > 0;

  return {
    userName: userPayload.name ?? "",
    userType: role,
    hasChildren,
    email: userPayload.email ?? "",
    balance: Number(userPayload.balance ?? 0),
    children: role === "parent" ? children : [],
  };
};

/**
 * 서버에서 받은 응답 데이터를 camelCase로 변환합니다.
 *
 * @template T
 * @param {T} payload - Axios 인터셉터를 거친 응답 데이터(순수 객체).
 * @returns {T} camelCase로 변환된 응답 데이터.
 */
export const mapAxiosResponse = <T = any>(payload: T): T => {
  if (!payload) return {} as T;
  return toCamelCaseKeys(payload);
};
/**
 * snake_case → camelCase 변환
 * axios 응답에 중첩 객체가 포함될 때 자동 변환.
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
 * `/home/parent` 엔드포인트(기본값)를 호출해 사용자 정보를 받아오고 Zustand에 반영합니다.
 *
 * @param {string} [url=requests.fetchHome] - 호출할 엔드포인트.
 * @returns {Promise<MappedUser>} 변환된 사용자 정보.
 */
export const fetchAndSetUser = async (
  url: string = requests.fetchHome
): Promise<MappedUser> => {
  const res = await api.get(url);
  const data = mapAxiosResponse(res);
  const mapped = mapUserFromDB(data);

  useUserStore
    .getState()
    .setUser(mapped.userName, mapped.userType, mapped.hasChildren);

  return mapped;
};
