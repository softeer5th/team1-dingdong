import {LoaderFunctionArgs} from "react-router-dom";
import {queryClient} from "@/main.tsx";
import {users_home_locations, users_me, users_notifications_checkUnread, users_reservations} from "@/api/query/users";
import handleError from "@/route/loader/handleError.ts";
import {INIT_PAGE, INIT_PAGE_SIZE} from "@/env.ts";
import removeReservationCache from "@/api/queryCacheRemove/reservations/removeReservationCache.ts";


export default async function loader({ request, params }: LoaderFunctionArgs) {
    if (request && params) {}

    try {
        if (window.location.pathname !== '/home') {
            // 홈은 배차 확정이 포함이라서 항상 최신이 필요하니 매번 초기화
            // 근데 이건 뒤로가기는 안먹힘. 따라서 사실상 새로고침을 해야 동작.
            removeReservationCache('HOME')
            queryClient.removeQueries({
                queryKey: ['/api/users/notifications/check-unread']
            })
        }

        // 알림 계속 지우기
        queryClient.removeQueries({
            queryKey: ['/api/users/notifications/check-unread']
        })

        const response = await Promise.all([
            queryClient.ensureQueryData(users_me()),
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    pageSize: INIT_PAGE_SIZE,
                    category: "HOME",
                    sort: "OLDEST",
                }
            )),
            queryClient.ensureQueryData(users_notifications_checkUnread()),
            queryClient.ensureQueryData(users_home_locations()),
        ])

        return [...response];

    } catch (error) {
        return handleError(error);
    }
}
