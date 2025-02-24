import {showErrorModal} from "@/route/error/index.tsx";
import preserveNavigate from "@/route/utils/preserveNavigate.ts";


export const PaymentErrorType = {
    DUPLICATE_BOOKING: 1100, // 중복 예매 시 발생하는 오류
    NO_SEATS: 1101, // 자리 없음
} as const;

// ✅ 타입 유추 (유니언 타입)
export type PaymentErrorType = typeof PaymentErrorType[keyof typeof PaymentErrorType];

export const paymentErrorHandler: Record<PaymentErrorType, (request: Request) => void> = {
    [PaymentErrorType.DUPLICATE_BOOKING]: (request) => {
        showErrorModal([" 이미 해당 시간에 버스 예매 내역이 존재해요"], ["다른 시간을 선택하거나, 기존 예약을 확인해 주세요."], "확인");
        preserveNavigate(request)
    },
    [PaymentErrorType.NO_SEATS]: (request) => {
        showErrorModal(
            ["해당 시간의 좌석이 모두 매진되었습니다."],
            ["다른 시간을 선택하거나, 기존 예약을 확인해 주세요."],
            "확인"
        );
        preserveNavigate(request);
    }

};