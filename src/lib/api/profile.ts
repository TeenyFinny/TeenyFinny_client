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
 */
export const getProfileInfo = async (): Promise<ProfileInfoRes> => {
  const response = await api.get<ProfileInfoRes>(requests.fetchProfileInfo);
  return response.data as ProfileInfoRes;
};
