import {queryClient} from "@/main.tsx";
import {users_reservations, users_reservations_interface} from "@/api/query/users";
import {INIT_PAGE, INIT_PAGE_SIZE} from "@/env.ts";
import {RevalidationState} from "react-router-dom";

export function getNextBusState (errorCallbackF: Function, reservations: users_reservations_interface['reservationInfos'], revalidate: () => Promise<void>, state: RevalidationState) {
    if (state === 'loading') return;

    queryClient.ensureQueryData(users_reservations({
        page: reservations.page.number + 1,
        pageSize: reservations.page.size,
        category: 'HOME',
        sort: 'OLDEST'
    })).then((result) => {
        queryClient.setQueryData<users_reservations_interface>(
            ['/api/users/reservations', {
                page: INIT_PAGE,
                pageSize: INIT_PAGE_SIZE,
                category: 'HOME',
                sort: 'OLDEST'
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

                return newData
            }
        )

        // loader 재실행
        revalidate()

    }).catch((err) => {
        errorCallbackF(err)
    })
}