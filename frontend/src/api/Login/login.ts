import { axiosInstance } from "@/api";
import { LoginDataType } from "@/hooks/Login/useLogin";

export async function postLogin(loginFormData: LoginDataType) {
  try {
    return axiosInstance.post("/api/auth/login", loginFormData);
  } catch (err: any) {
    console.error("로그인 실패:", err);
    throw new Error(err);
  }
}
