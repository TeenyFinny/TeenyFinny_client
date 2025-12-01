import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface ProfileInfoRes {
  user: UserProfile;
}

/**
 * 내 정보 조회
 * @param signal - AbortController signal (optional)
 */
export const getProfileInfo = async (
  signal?: AbortSignal
): Promise<ProfileInfoRes> => {
  const response = await api.get<ProfileInfoRes>(requests.fetchProfileInfo, {
    signal,
  });
  return response.data as ProfileInfoRes;
};

/**
 * 내 정보 업데이트
 * @param data - 업데이트할 프로필 정보
 */
export const updateProfileInfo = async (
  data: Partial<UserProfile>
): Promise<void> => {
  await api.patch(requests.updateProfileInfo, data);
};