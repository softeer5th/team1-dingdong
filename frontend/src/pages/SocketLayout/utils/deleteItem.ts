import {queryClient} from "@/main.tsx";
import {users_reservations, users_reservations_interface} from "@/api/query/users";
import {INIT_PAGE, INIT_PAGE_SIZE} from "@/env.ts";
import {FilterType} from "@/pages/Reservations/components/BookingHistory";


interface DeleteItemProps {
    deletedReservationId: number
    category: FilterType | 'HOME'
}
export async function deleteItem({deletedReservationId, category}: DeleteItemProps) {
    const reservationsObj = queryClient.getQueryData<users_reservations_interface>(
        ['/api/users/reservations', {
            page: INIT_PAGE,
            pageSize: INIT_PAGE_SIZE,
            category: category,
            sort: category === 'ALL' ? 'LATEST' : "OLDEST",
        }]
    )

    if (!reservationsObj) return

    // 페이지 계산
    const page = (reservationsObj.reservationInfos.page.number + 1) * reservationsObj.reservationInfos.page.size

    // 다음 페이지 아이템 1개 가져오기
    // 요청 보내기전에 혹시모를 캐시 삭제
    queryClient.removeQueries({
        queryKey: ['/api/users/reservations', {
            page: page,
            pageSize: 1,
            category: category,
            sort: category === 'ALL' ? 'LATEST' : "OLDEST",
        }],
    })
    const response = await queryClient.fetchQuery(users_reservations({
        page: page,
        pageSize: 1,
        category: category,
        sort: category === 'ALL' ? 'LATEST' : "OLDEST",
    }))

    // 추가될 마지막 아이템 1개
    const lastContent = response.reservationInfos.content[0]

    // 아이템 1개 삭제
    queryClient.setQueryData<users_reservations_interface>(
        ['/api/users/reservations', {
            page: INIT_PAGE,
            ...(category !== 'ALLOCATED' && { pageSize: INIT_PAGE_SIZE }),
            category: category,
            sort: category === 'ALL' ? 'LATEST' : "OLDEST",
        }],
        (oldData) => {
            // 심각한 에러, 코딩 에러임
            if (oldData == null) return oldData;

            const totalElements = lastContent == null ? oldData.reservationInfos.page.totalElements - 1 : oldData.reservationInfos.page.totalElements

            const newData: users_reservations_interface = {
                reservationInfos: {
                    content: [
                        ...oldData.reservationInfos.content.filter(({reservationId}) => reservationId !== deletedReservationId),
                        ...(lastContent == null ? [] : [lastContent])
                    ],
                    page: {
                        ...oldData.reservationInfos.page,
                        totalPages: Math.ceil(totalElements / INIT_PAGE_SIZE),
                        totalElements: totalElements
                    }
                }
            }

            return newData
        }
    )
}