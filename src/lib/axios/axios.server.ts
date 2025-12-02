// 서버 컴포넌트에서 사용
import axios, { InternalAxiosRequestConfig } from "axios";

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 /channel 프리픽스를 추가합니다.
axiosServer.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // URL이 /channel로 시작하지 않으면 프리픽스 추가
  if (config.url && !config.url.startsWith('/channel')) {
    config.url = `/channel${config.url}`;
  }
  return config;
});

// 서버에서는 localStorage, window 사용 금지!
export default axiosServer;