import {axiosInstance} from "@/api";
import {isAxiosError} from "axios";
import {CustomError} from "@/route/error";


export default async function middleware(request: Request) {
    const pathname = new URL(request.url).pathname; // 현재 URL 가져오기

    // 인증 처리
    try {
        await axiosInstance.get("/api/auth/status");
    }
    catch (error) {
        if (isAxiosError(error)) {
            // 인증 X
            if (error.response?.status === 401) {
                throw new CustomError(1000)
            }
            // 서버 응답 X
            else {
                throw new CustomError(1004)
            }
        }
        // 네트워크 에러 or 기타 에러
        else {
            throw new CustomError(1005)
        }
    }
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        // 인증 O
        throw new CustomError(1006)
    }

    // 세션처리
    switch (pathname) {
        case "/payment/purchase":
            // 이전 페이지에서 현재 페이지로 넘겨주는 값이 없다.
            if (sessionStorage.getItem("/fixed-bus-select-bus") == null) {
                throw new CustomError(1001)
            }
            break;
        case "/payment/reservation":
            if (sessionStorage.getItem("/custom-bus-booking") == null) {
                throw new CustomError(1002)
            }
            break;
        case "/fixed-bus-select-bus":
            if (sessionStorage.getItem("/fixed-bus-booking") == null) {
                throw new CustomError(1003)
            }
            break;
    }
}