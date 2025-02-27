import {LoaderFunctionArgs} from "react-router-dom";
import {axiosInstance} from "@/api";
import {queryClient} from "@/main.tsx";
import {users_home_locations, users_me, users_wallet_balances} from "@/api/query/users";
import handleError from "@/route/loader/handleError.ts";
import {isAxiosError} from "axios";
import {PaymentErrorType} from "@/route/error/payment/reservation.tsx";
import {CustomError} from "@/route/error";
import {formatUtcToKst} from "@/utils/time/formatUtcToKst.tsx";


export default async function loader({ request, params }: LoaderFunctionArgs) {

    if (request && params) {}

    // null이면 middleware에서 에러 감지해서 처리
    const schedule: ScheduleInterface = JSON.parse(sessionStorage.getItem('/custom-bus-booking') as string);


    try {
        queryClient.removeQueries({queryKey: ['/api/users/wallet/balances']})

        const response = await Promise.all([
            axiosInstance.post(`/api/users/reservations/token/general`, {
                direction: schedule.direction,
                dates: schedule.timeSchedule.map(date => ({
                    date: formatUtcToKst(date)
                }))
            }).then(res => res.data),
            queryClient.ensureQueryData(users_me()),
            queryClient.ensureQueryData(users_home_locations()),
            queryClient.ensureQueryData(users_wallet_balances()),
        ])

        return [...response, schedule];

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const code = error.response.data.code;
            if (code === "ALREADY_HAS_SAME_RESERVATION") {
                return new CustomError(PaymentErrorType.DUPLICATE_BOOKING)
            }
        }
        return handleError(error);
    }
}


export interface ScheduleInterface {
    direction: 'TO_HOME' | 'TO_SCHOOL';
    timeSchedule: string[];
}