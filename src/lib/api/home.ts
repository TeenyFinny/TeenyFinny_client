import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { HomeRes } from "@/types/home";

/**
 * 홈 화면 데이터 조회
 */
export const getHomeData = async (): Promise<HomeRes> => {
  const response = await api.get<HomeRes>(requests.fetchHome);
  return response.data;
};
