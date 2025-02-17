// 스타일
import {
    CardList,
    Header,
    HeaderActionButton,
    HeaderInfoText,
    HeaderLeftSection,
    HeaderRightSection,
    HeaderTitle,
    Wrapper
} from "@/pages/Home/component/BusState/styles.ts";
// 컴포넌트
import ArrowRightIcon from "@/components/designSystem/Icons/Home/ArrowRightIcon.tsx";
import BusReservation from "@/pages/Home/component/BusReservation";
import {AllocatedBusStateCard, PendingBusStateCard} from "@/pages/Home/component/BusStateCard";
import {
    TO_HOME_ALLOCATED,
    TO_HOME_NOT_ALLOCATED, TO_SCHOOL_ALLOCATED,
    TO_SCHOOL_NOT_ALLOCATED, users_reservations,
    users_reservations_interface
} from "@/api/query/users";
import {useNavigate} from "react-router-dom";
import React, {useRef, useState} from "react";
import {queryClient} from "@/main.tsx";
import LoadingCard from "@/pages/Home/component/LoadingCard";


interface BusStateProps {
    reservations: users_reservations_interface['reservationInfos'],
    busStateRef: React.RefObject<HTMLDivElement>
}

export default function BusState({reservations, busStateRef}: BusStateProps) {
    const navigate = useNavigate();
    const [content, setContent] = useState(reservations.content);
    const [isLast, setIsLast] = useState(reservations.page.number >= (reservations.page.totalPages - 1));
    const fetchInfo = useRef({
        pageSize: 5,
        page: 0
    })


    const getNextBusState = (errorCallbackF: Function) => {
        queryClient.fetchQuery(users_reservations({
            page: fetchInfo.current.page + 1,
            pageSize: fetchInfo.current.pageSize,
            category: 'HOME',
            sort: 'LATEST'
        })).then((result) => {
            const newContent = result.reservationInfos.content
            fetchInfo.current.page = result.reservationInfos.page.number
            setIsLast(result.reservationInfos.page.number >= (result.reservationInfos.page.totalPages - 1))
            setContent([...content, ...newContent])
        }).catch((err) => {
            errorCallbackF(err)
        })
    }

    return (
        <Wrapper ref={busStateRef}>
            <Header>
                <HeaderLeftSection>
                    <HeaderTitle>
                        예매
                    </HeaderTitle>
                    <HeaderTitle isZero={reservations.page.totalElements === 0}>
                        {reservations.page.totalElements}
                    </HeaderTitle>
                </HeaderLeftSection>
                <HeaderRightSection>
                    <HeaderInfoText>
                        전체보기
                    </HeaderInfoText>
                    <HeaderActionButton onClick={() => {
                        navigate('/reservations');
                    }}>
                        <ArrowRightIcon/>
                    </HeaderActionButton>
                </HeaderRightSection>
            </Header>
            {
                reservations.page.totalElements === 0 ?
                    <BusReservation/> :
                    <CardList>
                        {
                            content.map((data, key) => {
                                return getBusCardFunction(data.direction, data.reservationStatus)(data, key)
                            })
                        }
                        {
                            !isLast ?
                                <LoadingCard getNextBusState={getNextBusState}/> : null

                        }
                    </CardList>
            }
        </Wrapper>
    );
}


// 공통 Base 타입 추출
type BaseReservationInfo = users_reservations_interface["reservationInfos"]["content"][number];

// 기존 타입들을 묶어서 선언
type Direction = BaseReservationInfo["direction"];
type State = BaseReservationInfo["reservationStatus"];

const busFunctions = {
    TO_HOME: {
        PENDING: (data: Extract<BaseReservationInfo, TO_HOME_NOT_ALLOCATED>, key: number) => {
            const boardingDate = data.expectedDepartureTime // 학교에서 버스 출발 시간
            const boardingPoint = data.busStopName // 학교 이름

            return <PendingBusStateCard
                key={key}
                TO_HOME={{
                    boardingDate,
                    boardingPoint
                }}/>
        },
        ALLOCATED: (data: Extract<BaseReservationInfo, TO_HOME_ALLOCATED>, key: number) => {
            if (data.operationInfo.busStatus === 'ENDED') {
                return null
            }

            const boardingDate = data.expectedDepartureTime // 학교에서 버스 출발 시간
            const boardingPoint = data.busStopName // 학교 이름
            const dropOffPoint = '집'
            const dropOffDate = data.operationInfo.busStopArrivalTime
            const busNumber = data.operationInfo.busName
            const busScheduleId = data.operationInfo.busScheduleId
            const isRun = data.operationInfo.busStatus === 'RUNNING'

            return <AllocatedBusStateCard
                key={key}
                boardingDate={boardingDate}
                boardingPoint={boardingPoint}
                dropOffPoint={dropOffPoint}
                dropOffDate={dropOffDate}
                isRun={isRun}
                busNumber={busNumber}
                busScheduleId={busScheduleId}/>
        },
        FAIL_ALLOCATED: (data: any, key: number) => {
            console.log("FAIL_ALLOCATED function called", data, key);
            return null
        },
        CANCELED: (data: any, key: number) => {
            console.log("CANCELED function called", data, key);
            return null
        },
    },
    TO_SCHOOL: {
        PENDING: (data: Extract<BaseReservationInfo, TO_SCHOOL_NOT_ALLOCATED>, key: number) => {
            const dropOffPoint = data.busStopName
            const dropOffDate = data.expectedArrivalTime
            return <PendingBusStateCard
                key={key}
                TO_SCHOOL={{
                    dropOffDate,
                    dropOffPoint
                }}/>
        },
        ALLOCATED: (data: Extract<BaseReservationInfo, TO_SCHOOL_ALLOCATED>, key: number) => {
            if (data.operationInfo.busStatus === 'ENDED') {
                return null
            }

            const boardingDate = data.operationInfo.busStopArrivalTime // 승차 시간 (집 또는 지점)
            const boardingPoint = data.busStopName // 승차 이름 (집 또는 지점)
            const dropOffPoint = '학교'
            const dropOffDate = data.expectedArrivalTime // 하차 시간 (학교)
            const busNumber = data.operationInfo.busName
            const busScheduleId = data.operationInfo.busScheduleId
            const isRun = data.operationInfo.busStatus === 'RUNNING'

            return <AllocatedBusStateCard
                key={key}
                boardingDate={boardingDate}
                boardingPoint={boardingPoint}
                dropOffPoint={dropOffPoint}
                dropOffDate={dropOffDate}
                isRun={isRun}
                busNumber={busNumber}
                busScheduleId={busScheduleId}/>
        },
        FAIL_ALLOCATED: (data: any, key: number) => {
            console.log("FAIL_ALLOCATED function called", data, key);
            return null
        },
        CANCELED: (data: any, key: number) => {
            console.log("CANCELED function called", data, key);
            return null
        },
    }
};

function getBusCardFunction(busDirection: Direction, state: State) {
    return busFunctions[busDirection][state]
}