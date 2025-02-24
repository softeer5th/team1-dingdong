import {queryClient} from "@/main.tsx";
import {users_reservations, users_reservations_interface} from "@/api/query/users";
import {INIT_PAGE, INIT_PAGE_SIZE} from "@/env.ts";
import {FilterType, ReservationsRecord} from "@/pages/Reservations/components/BookingHistory";
import {RevalidationState} from "react-router-dom";

export function getNextBusState (errorCallbackF: Function, reservationsObj: ReservationsRecord, filterType: FilterType, revalidate: () => Promise<void>, state: RevalidationState) {
    if (state === 'loading') return;

    queryClient.ensureQueryData<users_reservations_interface>(users_reservations({
        page: reservationsObj[filterType].page.number + 1,
        pageSize: reservationsObj[filterType].page.size,
        category: filterType,
        sort: filterType === 'ALL' ? 'LATEST' : "OLDEST",
    })).then((result) => {
        reservationsObj[filterType].page.number = result.reservationInfos.page.number
        reservationsObj[filterType].page.totalPages = result.reservationInfos.page.totalPages

        queryClient.setQueryData<users_reservations_interface>(
            ['/api/users/reservations', {
                page: INIT_PAGE,
                ...(filterType !== 'ALLOCATED' && { pageSize: INIT_PAGE_SIZE }),
                category: filterType,
                sort: filterType === 'ALL' ? 'LATEST' : "OLDEST",
            }],
            (oldData) => {
                // 심각한 에러, 코딩 에러임
                if (oldData == null) return oldData;
                const newData: users_reservations_interface = {
                    reservationInfos: {
                        content: [
                            ...oldData.reservationInfos.content,
                            ...result.reservationInfos.content
                        ],
                        page: result.reservationInfos.page


                    }
                }
                console.log(oldData, newData)

                return newData
            }
        )

        // loader 재실행
        revalidate()

    }).catch((err) => {
        errorCallbackF(err)
    })
}