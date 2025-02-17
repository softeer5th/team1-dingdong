import {LoaderFunctionArgs} from "react-router-dom";
import {axiosInstance} from "@/api";
import {queryClient} from "@/main.tsx";
import {users_home_locations, users_me, users_wallet_balances} from "@/api/query/users";
import {formatKst} from "@/utils/time/formatKst.ts";
import handleError from "@/route/loader/handleError.ts";


export default async function loader({ request, params }: LoaderFunctionArgs) {

    if (request && params) {}

    // null이면 middleware에서 에러 감지해서 처리
    const schedule: ScheduleInterface = JSON.parse(sessionStorage.getItem('/custom-bus-booking') as string);


    try {

        const response = await Promise.all([
            axiosInstance.post(`/api/users/reservations/token/general`, {
                direction: schedule.direction,
                dates: schedule.timeSchedule.map(date => ({
                    date: formatKst(date)
                }))
            }).then(res => res.data),
            queryClient.fetchQuery(users_me()),
            queryClient.fetchQuery(users_home_locations()),
            queryClient.fetchQuery(users_wallet_balances()),
        ])

        return [...response, schedule];

    } catch (error) {
        handleError(error);
    }
}


export interface ScheduleInterface {
    direction: 'TO_HOME' | 'TO_SCHOOL';
    timeSchedule: string[];
}