import {axiosInstance} from "@/api";
import {isAxiosError} from "axios";
import {NavigateFunction} from "react-router-dom";
import {queryClient} from "@/main.tsx";

export async function logout (addToast: (message: string) => void, navigate: NavigateFunction) {
    try {
        await axiosInstance.post("/api/auth/logout")
        queryClient.clear()
        navigate("/")
    }
    catch (error) {
        if (isAxiosError(error) && error.response) {
            // 이미 로그아웃 or 로그인 안된 사용자
            if (error.response.status === 401) {
                navigate("/");
            }
            queryClient.clear()
        }
        addToast("서버와 통신이 원활하지 않습니다. 잠시후 다시 시도해주세요.")
    }
}