import {LoaderFunctionArgs} from "react-router-dom";
import {axiosInstance} from "@/api";
import {queryClient} from "@/main.tsx";
import { users_wallet_balances} from "@/api/query/users";
import handleError from "@/route/loader/handleError.ts";


export default async function loader({ request, params }: LoaderFunctionArgs) {
    if (request && params) {}

    // null이면 middleware에서 에러 감지해서 처리
    const schedule: ScheduleInterface = JSON.parse(sessionStorage.getItem("/fixed-bus-select-bus") as string);

    try {


        const response = await Promise.all([
            axiosInstance.post(`/api/users/reservations/token/together`, {
                busStopId: schedule.busStopName,
                busScheduleId: schedule.busId
                }).then(res => res.data),
            queryClient.fetchQuery(users_wallet_balances()),
        ])

        return response
    } catch (error) {
        handleError(error);
    }
}


export interface ScheduleInterface {
    direction: "TO_SCHOOL" | "TO_HOME";
    timeSchedule: string;
    busId: number;
    busStopName: string;
}