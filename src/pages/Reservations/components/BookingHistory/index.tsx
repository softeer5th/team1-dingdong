import FilterButton from "@/pages/Reservations/components/FilterButton";
import BusIcon from "@/components/designSystem/Icons/Home/BusIcon.tsx";
import BookingActionButton from "@/pages/Reservations/components/BookingActionButton";
import {
    BusNumber, DateText, Divide,
    FilterPanel,
    FilterScroll, HistoryItem, HistoryList, HistoryScroll, InfoBox, NoItemText, NoItemWrapper,
    SortIndicator, SortText, Status, StatusInfo, TripDivide, TripInfo, TripText,
    Wrapper
} from "@/pages/Reservations/components/BookingHistory/styles.ts";
import {useRef, useState} from "react";
import {
    TO_HOME_ALLOCATED,
    TO_SCHOOL_ALLOCATED,
    users_reservations,
    users_reservations_interface
} from "@/api/query/users";
import {queryClient} from "@/main.tsx";
import {formatKstDate} from "@/utils/time/formatKstDate.ts";
import {formatKstTime} from "@/utils/time/formatKstTime.ts";
import {TimeUntilArrival} from "@/pages/Home/component/BusStateCard";
import LoadingCard from "@/pages/Home/component/LoadingCard";
import {useMutation} from "@tanstack/react-query";
import {axiosInstance} from "@/api";


type FilterType = 'ALL' | 'ALLOCATED' | 'PENDING' | 'ENDED' | 'CANCELED';
type ReservationsRecord = Record<FilterType, users_reservations_interface['reservationInfos']['content']>
type ReservationsPageRecord = Record<FilterType, {page: number, pageSize: number, totalPages: number}>

interface BookingHistoryProps {
    allReservations: users_reservations_interface;
    allocatedReservations: users_reservations_interface;
    pendingReservations: users_reservations_interface;
    endedReservations: users_reservations_interface;
    canceledReservations: users_reservations_interface;
}
export default function BookingHistory({
                                           allReservations,
                                           allocatedReservations,
                                           pendingReservations,
                                           endedReservations,
                                           canceledReservations}: BookingHistoryProps) {

    const FILTER_TEXT_LIST: Record<FilterType, string> = {
        ALL: "전체",
        ALLOCATED: "배차 완료",
        PENDING: "배차 대기",
        ENDED: "이용 완료",
        CANCELED: "예매 취소"
    }
    const [filterType, setFilterType] = useState<FilterType>('ALL')

    const [reservationsObj, setReservationsObj] = useState<ReservationsRecord>({
        ALL: [...allReservations['reservationInfos']['content']],
        ALLOCATED: [...allocatedReservations['reservationInfos']['content']],
        PENDING: [...pendingReservations['reservationInfos']['content']],
        CANCELED: [...canceledReservations['reservationInfos']['content']],
        ENDED: [...endedReservations['reservationInfos']['content']],
    })
    const reservationsPageInfo = useRef<ReservationsPageRecord>({
        ALL: {page: 0, pageSize: 10, totalPages: allReservations.reservationInfos.page.totalPages},
        ALLOCATED: {page: 0, pageSize: -1, totalPages: allocatedReservations.reservationInfos.page.totalPages},
        PENDING: {page: 0, pageSize: 10, totalPages: pendingReservations.reservationInfos.page.totalPages},
        ENDED: {page: 0, pageSize: 10, totalPages: endedReservations.reservationInfos.page.totalPages},
        CANCELED: {page: 0, pageSize: 10, totalPages: canceledReservations.reservationInfos.page.totalPages},
    });


    const getNextBusState = (errorCallbackF: Function) => {
        queryClient.fetchQuery<users_reservations_interface>(users_reservations({
            page: reservationsPageInfo.current[filterType].page + 1,
            pageSize: reservationsPageInfo.current[filterType].pageSize,
            category: filterType,
            sort: filterType === 'ALL' ? 'LATEST' : "OLDEST",
        })).then((result) => {
            reservationsPageInfo.current[filterType].page = result.reservationInfos.page.number
            reservationsPageInfo.current[filterType].totalPages = result.reservationInfos.page.totalPages
            setReservationsObj((prev) => ({
                ...prev,
                [filterType]: [...prev[filterType], ...result.reservationInfos.content],
            }));
        }).catch((err) => {
            errorCallbackF(err)
        })
    }

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
                    {
                        reservationsObj[filterType].length === 0 ?
                            <NoItem /> : null
                    }
                    {
                        reservationsObj[filterType].map((item, index) => {
                            const componentList = []
                            if (item['reservationStatus'] === 'ALLOCATED') {
                                const direction = item.direction
                                componentList.push(
                                    <AllocatedItem
                                        key={index}
                                        status={item.operationInfo.busStatus}
                                        boardingDate={direction === 'TO_HOME' ? item.expectedDepartureTime : item.operationInfo.busStopArrivalTime}
                                        boardingPoint={item.busStopName}
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
                                                    boardingPoint: item.busStopName,
                                                    boardingDate: item.expectedDepartureTime
                                                }: undefined
                                        }
                                        TO_SCHOOL={
                                            item.direction === 'TO_SCHOOL' ?
                                                {
                                                    dropOffPoint: item.busStopName,
                                                    dropOffDate: item.expectedArrivalTime
                                                }: undefined
                                        }
                                        deleteItem={(deletedReservationId: number) => {
                                            setReservationsObj(prev => ({
                                            ...prev,
                                            [filterType]: reservationsObj[filterType].filter(({reservationId}) => reservationId !== deletedReservationId),
                                            }))
                                        }}
                                        reservationId={item.reservationId}/>)
                            }

                            if (index < reservationsObj[filterType].length - 1) {
                                componentList.push(<Divide key={`divide - ${index}`}/>)
                            }

                            return componentList
                        })
                    }
                    {
                        reservationsPageInfo.current[filterType].page < (reservationsPageInfo.current[filterType].totalPages - 1) ?
                            <LoadingCard getNextBusState={getNextBusState}/> : null

                    }
                </HistoryList>
            </HistoryScroll>
        </Wrapper>
    )
}


/* 여기에만 종속적인 모듈 */
interface AllocatedItemProps {
    status: TO_SCHOOL_ALLOCATED['operationInfo']['busStatus'] | TO_HOME_ALLOCATED['operationInfo']['busStatus'];
    boardingDate: string
    boardingPoint: string
    dropOffPoint: string
    dropOffDate: string
    busName: string
}
function AllocatedItem({
                           status,
                           boardingDate,
                           boardingPoint,
                           dropOffDate,
                           dropOffPoint,
                           busName}: AllocatedItemProps) {
    return (
        <HistoryItem>
            <InfoBox>
                <DateText>
                    {formatKstDate(boardingDate)}
                </DateText>
                <TripInfo>
                    <TripText>
                        {`${boardingPoint} ${formatKstTime(boardingDate)} 탑승`}
                    </TripText>
                    <TripDivide/>
                    <TripText>
                        {`${dropOffPoint} ${formatKstTime(dropOffDate)} 도착`}
                    </TripText>
                </TripInfo>
                <StatusInfo>
                    {status === 'ENDED' ?
                        <Status>운행 종료</Status>: null}
                    {status === 'RUNNING' || status === 'READY' ?
                        <>
                            <BusIcon/>
                            <BusNumber>
                                {busName}
                            </BusNumber>
                            {status === 'READY' ?
                                <Status>배차 완료</Status>:
                                <TimeUntilArrival dropOffDate={dropOffDate}/>
                            }
                        </>: null}
                </StatusInfo>
            </InfoBox>
            <BookingActionButton disabled={true}/>
        </HistoryItem>
    )
}


interface NotAllocatedItemProps {
    TO_HOME?: {
        boardingDate: string;
        boardingPoint: string;
    },
    TO_SCHOOL?: {
        dropOffPoint: string;
        dropOffDate: string;
    }
    reservationId: number;
    deleteItem: (deletedReservationId: number) => void;
}
function NotAllocatedItem({TO_HOME, TO_SCHOOL, reservationId, deleteItem}: NotAllocatedItemProps) {
    const deleteReservation = useMutation<void, Error, number>({
        mutationFn: (reservationId: number) => {
            return axiosInstance.delete(`/api/users/reservations/${reservationId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/users/reservations"] });
            deleteItem(reservationId)
        },
        onError: error => {
            console.log('삭제 에러', error)
        }
    });



    return (
        <HistoryItem>
            <InfoBox>
                <DateText>
                    {
                        TO_HOME != null ?
                            formatKstDate(TO_HOME.boardingDate) : null
                    }
                    {
                        TO_SCHOOL != null ?
                            formatKstDate(TO_SCHOOL.dropOffDate) : null
                    }
                </DateText>
                <TripInfo>
                    <TripText>
                        {
                            // 하교 (학교)
                            TO_HOME != null ?
                                `${TO_HOME.boardingPoint} ${formatKstTime(TO_HOME.boardingDate)} 탑승` : null
                        }
                        {
                            // 등교 (집)
                            TO_SCHOOL != null ?
                                `${TO_SCHOOL.dropOffPoint} 탑승` : null
                        }
                    </TripText>
                    <TripDivide/>
                    <TripText>
                        {
                            // 하교 (집)
                            TO_HOME != null ?
                                `집 도착` : null
                        }
                        {
                            // 등교 (학교)
                            TO_SCHOOL != null ?
                                `학교 ${formatKstTime(TO_SCHOOL.dropOffDate)} 도착` : null
                        }
                    </TripText>
                </TripInfo>
                <StatusInfo>
                    <Status>배차 대기</Status>
                </StatusInfo>
            </InfoBox>
            <BookingActionButton disabled={false} onClick={() => deleteReservation.mutate(reservationId)}/>
        </HistoryItem>
    )
}

function NoItem() {
    return (
        <NoItemWrapper>
            <NoItemText>
                내역이 없어요.
            </NoItemText>
        </NoItemWrapper>
    )
}
