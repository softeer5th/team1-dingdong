import {queryClient} from "@/main.tsx";
import {users_reservations_interface} from "@/api/query/users";
import {INIT_PAGE, INIT_PAGE_SIZE} from "@/env.ts";
import {FilterType} from "@/pages/Reservations/components/BookingHistory";
import {getReservationById} from "@/pages/SocketLayout/utils/getReservationById.ts";

interface ChangeItemProps {
    reservationId: number
    category: FilterType | 'HOME'
}
export async function changeItem({reservationId, category}: ChangeItemProps) {
    const {reservationInfo} = await getReservationById(reservationId)


    queryClient.setQueryData<users_reservations_interface>(
        ['/api/users/reservations', {
            page: INIT_PAGE,
            pageSize: INIT_PAGE_SIZE,
            category: category,
            sort: category === 'ALL' ? 'LATEST' : "OLDEST",
        }],
        (oldData) => {
            // 심각한 에러, 코딩 에러임
            if (oldData == null) return oldData;

            // 동일 id 있는지 찾기
            const index = oldData.reservationInfos.content.findIndex(content => content.reservationId === reservationId);

            // 동일 없음
            if (index === -1) {
                return
            }

            console.log("old", oldData)
            const newData: users_reservations_interface = {
                reservationInfos: {
                    content: [
                        ...oldData.reservationInfos.content.slice(0, index),
                        reservationInfo,
                        ...oldData.reservationInfos.content.slice(index + 1)
                    ],
                    page: oldData.reservationInfos.page
                }
            }
            console.log("new", newData)
            return newData
        }
    )
}