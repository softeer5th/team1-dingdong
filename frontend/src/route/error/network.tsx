import {showErrorModal} from "@/route/error/index.tsx";
import preserveNavigate from "@/route/utils/preserveNavigate.ts";


export const NetworkErrorType = {
    BAD_REQUEST: 400,               // 잘못된 요청
    FORBIDDEN: 403,                 // 접근 권한 없음
    NOT_FOUND: 404,                 // 리소스를 찾을 수 없음
    INTERNAL_SERVER_ERROR: 500,      // 서버 오류
    NETWORK_TIMEOUT: 408,            // 요청 시간 초과
    SERVICE_UNAVAILABLE: 503,        // 서비스 이용 불가
    NETWORK_ERROR: 'network_error',  // 일반적인 네트워크 오류
    UNKNOWN_ERROR: 'unknown_error'   // 알 수 없는 오류
} as const;

// ✅ 타입 유추 (유니언 타입)
export type NetworkErrorType = typeof NetworkErrorType[keyof typeof NetworkErrorType];

export const networkErrorHandler: Record<NetworkErrorType, (request: Request) => void> = {
    [NetworkErrorType.BAD_REQUEST]: (request) => {
        showErrorModal(["⛔ 400 BadRequest:", " 잘못된 요청입니다."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.FORBIDDEN]: (request) => {
        showErrorModal(["⛔ 403 Forbidden:"," 접근 권한이 없습니다."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.NOT_FOUND]: (request) => {
        showErrorModal(["🔍 404 Not Found:", " 리소스를 찾을 수 없습니다."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.INTERNAL_SERVER_ERROR]: (request) => {
        showErrorModal(["🔥 500 Internal Server Error:", " 서버 오류 발생."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.NETWORK_TIMEOUT]: (request) => {
        showErrorModal(["⏳ 408 Request Timeout:", "요청 시간이 초과되었습니다."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.SERVICE_UNAVAILABLE]: (request) => {
        showErrorModal(["🚧 503 Service Unavailable:", "서비스를 이용할 수 없습니다."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.NETWORK_ERROR]: (request) => {
        showErrorModal(["⚠️ 네트워크 오류:", "네트워크 연결이 불안정합니다."], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
    [NetworkErrorType.UNKNOWN_ERROR]: (request) => {
        showErrorModal(["❓ 알 수 없는 오류 발생:"], ["잠시 후 다시 시도해 주세요."], "확인");
        preserveNavigate(request)
    },
};