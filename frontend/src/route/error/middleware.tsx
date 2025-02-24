import navigateTo from "@/route/utils/navigateTo.ts";
import {showErrorModal} from "@/route/error/index.tsx";
import preserveNavigate from "@/route/utils/preserveNavigate.ts";

export const MiddlewareErrorType = {
    NOT_LOGGED_IN: 1000,
    INVALID_ACCESS_PAYMENT: 1001,
    INVALID_ACCESS_CUSTOM_BUS: 1002,
    INVALID_ACCESS_FIXED_BUS: 1003,
    SERVER_NO_RESPONSE: 1004,
    NETWORK_ERROR: 1005,
    ALREADY_LOGGED_IN: 1006,
} as const;
export type MiddlewareErrorType = typeof MiddlewareErrorType[keyof typeof MiddlewareErrorType];

export const middlewareErrorHandler: Record<MiddlewareErrorType, (request: Request) => void> = {
    [MiddlewareErrorType.NOT_LOGGED_IN]: (request) => {
        showErrorModal(["로그인이 필요한 서비스"], ["로그인 페이지로 이동하겠습니다."], "확인", () => navigateTo('/'))
        preserveNavigate(request)
    },
    [MiddlewareErrorType.ALREADY_LOGGED_IN]: () => {
        navigateTo('/home')
    },
    [MiddlewareErrorType.INVALID_ACCESS_PAYMENT]: (request) => {
        showErrorModal(["예매할 버스를 선택해주세요"], ["결제를 진행하려면 먼저 원하는 버스를 선택해야 합니다."], "버스 선택 페이지로 이동", () => navigateTo('/fixed-bus-select-bus'))
        preserveNavigate(request)
    },
    [MiddlewareErrorType.INVALID_ACCESS_CUSTOM_BUS]: (request) => {
        showErrorModal(["예매할 버스를 선택해주세요"], ["결제를 진행하려면 먼저 원하는 버스를 선택해야 합니다."], "버스 선택 페이지로 이동", () => navigateTo('/custom-bus-booking'))
        preserveNavigate(request)
    },
    [MiddlewareErrorType.INVALID_ACCESS_FIXED_BUS]: (request) => {
        showErrorModal(["탑승 시간을 선택해주세요"], ["탑승 시간을 선택하면 이용 가능한 버스 목록을 확인할 수 있습니다."], "탑승 시간 선택하러 가기", () => navigateTo('/fixed-bus-booking'))
        preserveNavigate(request)
    },
    [MiddlewareErrorType.SERVER_NO_RESPONSE]: (request) => {
        showErrorModal(["서버 응답이 없음"], ["서버에서 응답을 받을 수 없습니다."], "확인")
        preserveNavigate(request)
    },
    [MiddlewareErrorType.NETWORK_ERROR]: (request) => {
        showErrorModal(["네트워크 문제 또는 API 오류"], ["네트워크 문제로 요청을 처리할 수 없습니다."], "확인")
        preserveNavigate(request)
    }
}