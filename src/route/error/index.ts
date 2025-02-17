import {middlewareErrorHandler, middlewareErrorType} from "@/route/error/middleware.tsx";
import {networkErrorHandler, networkErrorType} from "@/route/error/network.tsx";

export type errorType = middlewareErrorType | networkErrorType
export const errorHandlers: Record<errorType, Function> = {
    ...middlewareErrorHandler,
    ...networkErrorHandler
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