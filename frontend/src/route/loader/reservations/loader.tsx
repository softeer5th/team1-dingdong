import {LoaderFunctionArgs} from "react-router-dom";
import {queryClient} from "@/main.tsx";
import {users_me, users_reservations} from "@/api/query/users";
import handleError from "@/route/loader/handleError.ts";
import {INIT_PAGE, INIT_PAGE_SIZE} from "@/env.ts";
//import removeReservationCache from "@/api/queryCacheRemove/reservations/removeReservationCache.ts";


export default async function loader({ request, params }: LoaderFunctionArgs) {

    if (request && params) {}

    try {

        const response = await Promise.all([
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    pageSize: INIT_PAGE_SIZE,
                    category: "ALL",
                    sort: "LATEST",
                }
            )),
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    category: "ALLOCATED",
                    sort: "OLDEST",
                }
            )),
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    pageSize: INIT_PAGE_SIZE,
                    category: "PENDING",
                    sort: "OLDEST",
                }
            )),
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    pageSize: INIT_PAGE_SIZE,
                    category: "FAIL_ALLOCATED",
                    sort: "OLDEST",
                }
            )),
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    pageSize: INIT_PAGE_SIZE,
                    category: "ENDED",
                    sort: "OLDEST",
                }
            )),
            queryClient.ensureQueryData(users_reservations(
                {
                    page: INIT_PAGE,
                    pageSize: INIT_PAGE_SIZE,
                    category: "CANCELED",
                    sort: "OLDEST",
                }
            )),
            queryClient.ensureQueryData(users_me())
        ])

        return [...response];

    } catch (error) {
        return handleError(error);
    }
}
