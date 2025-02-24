import {isAxiosError} from "axios";
import {CustomError} from "@/route/error";
import {NetworkErrorType} from "@/route/error/network.tsx";


export default function handleError(error: unknown) {
    if (isAxiosError(error) && error.response?.status) {
        const status = error.response.status;

        switch (status) {
            case 400:
                return new CustomError(NetworkErrorType.BAD_REQUEST)
            case 403:
                return new CustomError(NetworkErrorType.FORBIDDEN)
            case 404:
                return new CustomError(NetworkErrorType.NOT_FOUND)
            case 408:
                return new CustomError(NetworkErrorType.NETWORK_TIMEOUT)
            case 500:
                return new CustomError(NetworkErrorType.INTERNAL_SERVER_ERROR)
            case 503:
                return new CustomError(NetworkErrorType.SERVICE_UNAVAILABLE)
            default:
                return new CustomError(NetworkErrorType.NETWORK_ERROR)
        }
    }

    return new CustomError(NetworkErrorType.UNKNOWN_ERROR)
}