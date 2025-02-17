import {isAxiosError} from "axios";
import {CustomError} from "@/route/error";


export default function handleError(error: unknown) {
    if (isAxiosError(error) && error.response?.status) {
        const status = error.response.status;

        switch (status) {
            case 403:
                return new CustomError(403)
            case 404:
                return new CustomError(404)
            case 500:
                return new CustomError(500)
            default:
                return new CustomError("network_default")
        }
    }

    // 에러를 다시 throw하여 상위에서 핸들링 가능하도록 유지
    return new CustomError("network_default")
}