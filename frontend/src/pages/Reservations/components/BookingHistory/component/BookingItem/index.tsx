import NoItem from "@/pages/Reservations/components/BookingHistory/component/BookingItem/No";
import AllocatedItem from "@/pages/Reservations/components/BookingHistory/component/BookingItem/Allocated";
import NotAllocatedItem from "@/pages/Reservations/components/BookingHistory/component/BookingItem/NotAllocated";
import {Divide} from "@/pages/Reservations/components/BookingHistory/styles.ts";
import LoadingCard from "@/pages/Home/component/LoadingCard";
import {getNextBusState} from "@/pages/Reservations/utils/getNextBusState.ts";
import useToast from "@/hooks/useToast";
import {FilterType, ReservationsRecord} from "@/pages/Reservations/components/BookingHistory";
import {useRevalidator} from "react-router-dom";
import {deleteItem} from "@/pages/SocketLayout/utils/deleteItem.ts";
import {changeItem} from "@/pages/SocketLayout/utils/changeItem.ts";
import removeReservationCache from "@/api/queryCacheRemove/reservations/removeReservationCache.ts";
import {addRefundHistory} from "@/pages/Wallet/utils/addRefundHistory.ts";


interface RenderBookingItemList {
    reservationsObj: ReservationsRecord,
    filterType: FilterType,
    schoolName: string
}
export default function RenderBookingItemList({reservationsObj, filterType, schoolName}: RenderBookingItemList) {
    const addToast = useToast();
    const { revalidate, state } = useRevalidator();

    return (
        <>
            {
                reservationsObj[filterType].content.length === 0 ?
                    <NoItem /> : null
            }
            {
                reservationsObj[filterType].content.map((item, index) => {
                    const componentList = []
                    if (item['reservationStatus'] === 'ALLOCATED') {
                        const direction = item.direction
                        componentList.push(
                            <AllocatedItem
                                key={index}
                                status={item.operationInfo.busStatus}
                                boardingDate={direction === 'TO_HOME' ? item.expectedDepartureTime : item.operationInfo.busStopArrivalTime}
                                boardingPoint={direction === 'TO_HOME' ? schoolName : item.busStopName}
                                dropOffPoint={direction === 'TO_HOME' ? '집' : '학교'}
                                dropOffDate={direction === 'TO_HOME' ? item.operationInfo.busStopArrivalTime : item.expectedArrivalTime}
                                busName={item.operationInfo.busName} />
                        )
                    }
                    else {
                        componentList.push(
                            <NotAllocatedItem
                                key={index}
                                TO_HOME={
                                    item.direction === 'TO_HOME' ?
                                        {
                                            boardingPoint: schoolName,
                                            boardingDate: item.expectedDepartureTime,
                                        }: undefined
                                }
                                TO_SCHOOL={
                                    item.direction === 'TO_SCHOOL' ?
                                        {
                                            dropOffPoint: item.busStopName,
                                            dropOffDate: item.expectedArrivalTime,
                                        }: undefined
                                }
                                status={item.reservationStatus}
                                deleteItem={async (deletedReservationId) => {
                                    try {
                                        if (state === 'loading') return
                                        await changeItem({reservationId: deletedReservationId, category: 'ALL'})

                                        // 배차 대기에서 취소인거 지우기
                                        await deleteItem({deletedReservationId, category: 'PENDING'})
                                        await deleteItem({deletedReservationId, category: 'HOME'})

                                        // 취소 위치를 모르니 캐시 지우기
                                        removeReservationCache('CANCELED')
                                        // 잔고 갱신
                                        addRefundHistory()

                                        revalidate()
                                        addToast("예매가 성공적으로 취소 되었습니다.")
                                    }
                                    catch (error) {
                                        addToast("예매 취소 중에 문제가 발생했습니다.")
                                    }
                                }}
                                reservationId={item.reservationId}/>)
                    }

                    if (index < reservationsObj[filterType].content.length - 1) {
                        componentList.push(<Divide key={`divide - ${index}`}/>)
                    }

                    return componentList
                })
            }
            {
                reservationsObj[filterType].page.number < (reservationsObj[filterType].page.totalPages - 1) ?
                    <LoadingCard getNextBusState={(errorCallbackF) => getNextBusState(errorCallbackF, reservationsObj, filterType, revalidate, state)}/> : null

            }
        </>
    )
}