import {middlewareErrorHandler, MiddlewareErrorType} from "@/route/error/middleware.tsx";
import {networkErrorHandler, NetworkErrorType} from "@/route/error/network.tsx";
import Modal from "@/components/Modal";
import {mountModal} from "@/components/Loading";
import {paymentErrorHandler, PaymentErrorType,} from "@/route/error/payment/reservation.tsx";

export type errorType = MiddlewareErrorType | NetworkErrorType | PaymentErrorType
export const errorHandlers: Record<errorType, Function> = {
    ...middlewareErrorHandler,
    ...networkErrorHandler,
    ...paymentErrorHandler
}

export class CustomError {
    public errorType: errorType;
    constructor(errorType: errorType) {
        this.errorType = errorType
    }
}

export function executeErrorHandler(errorType: errorType, request: Request) {
    errorHandlers[errorType](request)
}

// 공통 헬퍼 함수

export function showErrorModal(title: string[], text: string[], buttonText: string, onClick: () => void = () => null) {
    requestAnimationFrame(() => {
        const { render, unmountModal } = mountModal();
        render(
            <Modal
                title={title}
                text={text}
                isError={true}
                leftButton={{
                    text: buttonText,
                    onClick: () => {
                        unmountModal();
                        onClick();
                    },
                }}
            />
        );
    });
}
