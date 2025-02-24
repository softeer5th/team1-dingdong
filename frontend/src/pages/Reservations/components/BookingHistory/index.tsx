import FilterButton from "@/pages/Reservations/components/FilterButton";
import {
    FilterPanel,
    FilterScroll, HistoryList, HistoryScroll,
    SortIndicator, SortText,
    Wrapper
} from "@/pages/Reservations/components/BookingHistory/styles.ts";
import {useMemo, useState} from "react";
import {
    users_reservations_interface
} from "@/api/query/users";
import RenderBookingItemList from "@/pages/Reservations/components/BookingHistory/component/BookingItem";


export type FilterType = 'ALL' | 'ALLOCATED' | 'PENDING' | 'FAIL_ALLOCATED' | 'ENDED' | 'CANCELED';
export type ReservationsRecord = Record<FilterType, users_reservations_interface['reservationInfos']>

export const FILTER_TEXT_LIST: Record<FilterType, string> = {
    ALL: "전체",
    ALLOCATED: "배차 완료",
    PENDING: "배차 대기",
    FAIL_ALLOCATED: "배차 실패",
    ENDED: "이용 완료",
    CANCELED: "예매 취소"
}

interface BookingHistoryProps {
    schoolName: string
    allReservations: users_reservations_interface;
    allocatedReservations: users_reservations_interface;
    pendingReservations: users_reservations_interface;
    failAllocatedReservations: users_reservations_interface;
    endedReservations: users_reservations_interface;
    canceledReservations: users_reservations_interface;
}
export default function BookingHistory({
                                           schoolName,
                                           allReservations,
                                           allocatedReservations,
                                           pendingReservations,
                                           failAllocatedReservations,
                                           endedReservations,
                                           canceledReservations}: BookingHistoryProps) {

    const [filterType, setFilterType] = useState<FilterType>('ALL')

    const reservationsObj = useMemo<ReservationsRecord>(() => ({
        ALL: allReservations.reservationInfos,
        ALLOCATED: allocatedReservations.reservationInfos,
        PENDING: pendingReservations.reservationInfos,
        FAIL_ALLOCATED: failAllocatedReservations.reservationInfos,
        CANCELED: canceledReservations.reservationInfos,
        ENDED: endedReservations.reservationInfos,
    }), [allReservations, allocatedReservations, pendingReservations, failAllocatedReservations, canceledReservations, endedReservations]);


    return (
        <Wrapper>
            <FilterPanel>
                <FilterScroll>
                    {
                        Object.entries(FILTER_TEXT_LIST).map(([filterType2, text]) => (
                            <li key={filterType2}>
                                <FilterButton text={text} isActive={filterType2 === filterType} onClick={() => setFilterType(filterType2 as FilterType)}/>
                            </li>
                        ))
                    }
                </FilterScroll>
            </FilterPanel>
            <SortIndicator>
                <SortText>
                    {filterType === 'ALL' ? '최신순' : "오래된순"}
                </SortText>
            </SortIndicator>
            <HistoryScroll>
                <HistoryList>
                    <RenderBookingItemList reservationsObj={reservationsObj} filterType={filterType} schoolName={schoolName} />
                </HistoryList>
            </HistoryScroll>
        </Wrapper>
    )
}


