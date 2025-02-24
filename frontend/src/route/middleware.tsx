import {axiosInstance} from "@/api";
import {isAxiosError} from "axios";
import {CustomError} from "@/route/error";
import {MiddlewareErrorType} from "@/route/error/middleware.tsx";

const sessionRules = new Map([
    ["/payment/purchase", { sessionKey: "/fixed-bus-select-bus", errorType: MiddlewareErrorType.INVALID_ACCESS_PAYMENT }],
    ["/payment/reservation", { sessionKey: "/custom-bus-booking", errorType: MiddlewareErrorType.INVALID_ACCESS_CUSTOM_BUS }],
    ["/fixed-bus-select-bus", { sessionKey: "/fixed-bus-booking", errorType: MiddlewareErrorType.INVALID_ACCESS_FIXED_BUS }],
]);

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
                if (!(pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
                    // 로그인 안했으면, 해당 페이지 제외 접근 불가
                    throw new CustomError(MiddlewareErrorType.NOT_LOGGED_IN)
                }
            }
            // 서버 응답 X
            else {
                throw new CustomError(MiddlewareErrorType.SERVER_NO_RESPONSE)
            }
        }
        // 네트워크 에러 or 기타 에러
        else {
            throw new CustomError(MiddlewareErrorType.NETWORK_ERROR)
        }

        return null;
    }
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        // 인증 O
        throw new CustomError(MiddlewareErrorType.ALREADY_LOGGED_IN)
    }

    // 세션처리
    if (sessionRules.has(pathname) && !sessionStorage.getItem(sessionRules.get(pathname)!.sessionKey)) {
        throw new CustomError(sessionRules.get(pathname)!.errorType);
    }
}