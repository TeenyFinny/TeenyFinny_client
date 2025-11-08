// 서버 컴포넌트에서 사용
import axios from "axios";

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 서버에서는 localStorage, window 사용 금지!
export default axiosServer;