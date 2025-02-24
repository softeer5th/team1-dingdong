

// 공통 Base 타입 추출
import {
    TO_HOME_ALLOCATED,
    TO_HOME_NOT_ALLOCATED, TO_SCHOOL_ALLOCATED,
    TO_SCHOOL_NOT_ALLOCATED,
    users_reservations_interface
} from "@/api/query/users";
import {PendingBusStateCard} from "@/pages/Home/component/BusState/component/BusStateCard/PendingBusStateCard";
import {AllocatedBusStateCard} from "@/pages/Home/component/BusState/component/BusStateCard/AllocatedBusStateCard";

type BaseReservationInfo = users_reservations_interface["reservationInfos"]["content"][number];

// 기존 타입들을 묶어서 선언
type Direction = BaseReservationInfo["direction"];
type State = BaseReservationInfo["reservationStatus"];

const busFunctions = {
    TO_HOME: {
        PENDING: (data: Extract<BaseReservationInfo, TO_HOME_NOT_ALLOCATED>, key: number, schoolName: string) => {
            const boardingDate = data.expectedDepartureTime // 학교에서 버스 출발 시간
            const boardingPoint = schoolName // 학교 이름
            const dropOffPoint = data.busStopName

            return <PendingBusStateCard
                key={key}
                TO_HOME={{
                    boardingDate,
                    boardingPoint,
                    dropOffPoint
                }}/>
        },
        ALLOCATED: (data: Extract<BaseReservationInfo, TO_HOME_ALLOCATED>, key: number, schoolName: string, isLink: boolean = true) => {
            if (data.operationInfo.busStatus === 'ENDED') {
                return null
            }

            const boardingDate = data.expectedDepartureTime // 학교에서 버스 출발 시간
            const boardingPoint = schoolName // 학교 이름
            const dropOffPoint = data.busStopName
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
                busScheduleId={busScheduleId}
                isLink={isLink}/>
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
        PENDING: (data: Extract<BaseReservationInfo, TO_SCHOOL_NOT_ALLOCATED>, key: number, schoolName: string) => {
            const boardingPoint = data.busStopName
            const dropOffPoint = schoolName
            const dropOffDate = data.expectedArrivalTime
            return <PendingBusStateCard
                key={key}
                TO_SCHOOL={{
                    boardingPoint,
                    dropOffDate,
                    dropOffPoint
                }}/>
        },
        ALLOCATED: (data: Extract<BaseReservationInfo, TO_SCHOOL_ALLOCATED>, key: number, schoolName: string, isLink: boolean = true) => {
            if (data.operationInfo.busStatus === 'ENDED') {
                return null
            }

            const boardingDate = data.operationInfo.busStopArrivalTime // 승차 시간 (집 또는 지점)
            const boardingPoint = data.busStopName // 승차 이름 (집 또는 지점)
            const dropOffPoint = schoolName
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
                busScheduleId={busScheduleId}
                isLink={isLink}/>
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

export function getBusCardFunction(busDirection: Direction, state: State) {
    return busFunctions[busDirection][state]
}