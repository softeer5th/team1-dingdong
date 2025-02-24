import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 서버 주소 => 서버 배포 이후 환경변수에 저장하여 변경.
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 세션 쿠키 자동으로 포함
});
