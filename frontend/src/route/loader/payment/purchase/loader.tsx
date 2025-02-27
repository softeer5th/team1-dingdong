import {LoaderFunctionArgs} from "react-router-dom";
import {axiosInstance} from "@/api";
import {queryClient} from "@/main.tsx";
import { users_wallet_balances} from "@/api/query/users";
import handleError from "@/route/loader/handleError.ts";
import {isAxiosError} from "axios";
import {PaymentErrorType} from "@/route/error/payment/reservation.tsx";
import {CustomError} from "@/route/error";


export default async function loader({ request, params }: LoaderFunctionArgs) {
    if (request && params) {}

    // null이면 middleware에서 에러 감지해서 처리
    const schedule: ScheduleInterface = JSON.parse(sessionStorage.getItem("/fixed-bus-select-bus") as string);

    try {
        queryClient.removeQueries({queryKey: ['/api/users/wallet/balances']})

        const response = await Promise.all([
            axiosInstance.post(`/api/users/reservations/token/together`, {
                busStopId: schedule.busStopId,
                busScheduleId: schedule.busId
                }).then(res => res.data),
            queryClient.ensureQueryData(users_wallet_balances()),
        ])

        return [...response, schedule]
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const code = error.response.data.code;
            if (code === "ALREADY_HAS_SAME_RESERVATION") {
                return new CustomError(PaymentErrorType.DUPLICATE_BOOKING)
            }
            if (code === "NO_SEATS") {
                return new CustomError(PaymentErrorType.NO_SEATS)
            }
        }
        return handleError(error);
    }
}


export interface ScheduleInterface {
    direction: "TO_SCHOOL" | "TO_HOME";
    timeSchedule: string;
    busId: number;
    busStopName: string;
    busStopId: number;
}