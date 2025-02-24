import { createQueryFactory } from "@/api/query/createQueryFactory.ts";

export interface users_me_interface {
  userName: string;
  email: string;
  schoolName: string;
}
export const users_me = createQueryFactory<users_me_interface>("/api/users/me");



/**
 * 🚍 학교에서 집으로 가는 버스 예약이 완료된 경우
 * @property {"TO_HOME"} direction 버스 이동 방향 (학교 → 집)
 * @property {string} expectedDepartureTime 학교에서 버스 출발 시간 (탑승 시간) @format HH:mm
 * @property {"ALLOCATED"} reservationStatus 예약 상태 (배정 완료)
 * @property {object} operationInfo 배정된 버스 정보
 * @property {number} operationInfo.busScheduleId 버스 일정 ID
 * @property {"READY" | "RUNNING" | "ENDED"} operationInfo.busStatus 현재 버스 상태
 * @property {string} operationInfo.busName 버스 이름
 * @property {string} operationInfo.busStopArrivalTime 집 도착 시간 (하차 시간) @format HH:mm
 */
export interface TO_HOME_ALLOCATED {
    direction: "TO_HOME";
    expectedDepartureTime: string;
    reservationStatus: "ALLOCATED";
    operationInfo: {
        busScheduleId: number;
        busStatus: "READY" | "RUNNING" | "ENDED";
        busName: string;
        busStopArrivalTime: string;
    };
}

/**
 * 🚍 학교에서 집으로 가는 버스 예약이 아직 배정되지 않은 경우
 * @property {"TO_HOME"} direction 버스 이동 방향 (학교 → 집)
 * @property {string} expectedDepartureTime 학교에서 버스 출발 시간 (탑승 시간) @format HH:mm
 * @property {"PENDING" | "FAIL_ALLOCATED" | "CANCELED"} reservationStatus 예약 상태 (배정 대기, 배정 실패, 취소)
 */
export interface TO_HOME_NOT_ALLOCATED {
    direction: "TO_HOME";
    expectedDepartureTime: string;
    reservationStatus: "PENDING" | "FAIL_ALLOCATED" | "CANCELED";
}

/**
 * 🚍 집에서 학교로 가는 버스 예약이 완료된 경우
 * @property {"TO_SCHOOL"} direction 버스 이동 방향 (집 → 학교)
 * @property {string} expectedArrivalTime 집에서 버스 출발 시간 (탑승 시간) @format HH:mm
 * @property {"ALLOCATED"} reservationStatus 예약 상태 (배정 완료)
 * @property {object} operationInfo 배정된 버스 정보
 * @property {number} operationInfo.busScheduleId 버스 일정 ID
 * @property {"READY" | "RUNNING" | "ENDED"} operationInfo.busStatus 현재 버스 상태
 * @property {string} operationInfo.busName 버스 이름
 * @property {string} operationInfo.busStopArrivalTime 학교 도착 시간 (하차 시간) @format HH:mm
 */
export interface TO_SCHOOL_ALLOCATED {
    direction: "TO_SCHOOL";
    expectedArrivalTime: string;
    reservationStatus: "ALLOCATED";
    operationInfo: {
        busScheduleId: number;
        busStatus: "READY" | "RUNNING" | "ENDED";
        busName: string;
        busStopArrivalTime: string;
    };
}

/**
 * 🚍 집에서 학교로 가는 버스 예약이 아직 배정되지 않은 경우
 * @property {"TO_SCHOOL"} direction 버스 이동 방향 (집 → 학교)
 * @property {string} expectedArrivalTime 집에서 버스 출발 시간 (탑승 시간) @format HH:mm
 * @property {"PENDING" | "FAIL_ALLOCATED" | "CANCELED"} reservationStatus 예약 상태 (배정 대기, 배정 실패, 취소)
 */
export interface TO_SCHOOL_NOT_ALLOCATED {
    direction: "TO_SCHOOL";
    expectedArrivalTime: string;
    reservationStatus: "PENDING" | "FAIL_ALLOCATED" | "CANCELED";
}

export interface users_reservations_interface {
    reservationInfos: {
        content: ({
            reservationId: number;
            startDate: string;
            busStopName: string;
        } & (
            TO_SCHOOL_NOT_ALLOCATED
            | TO_HOME_NOT_ALLOCATED
            | TO_SCHOOL_ALLOCATED
            | TO_HOME_ALLOCATED
            )
        )[]
        page: {
            size: number,
            number: number,
            totalElements: number,
            totalPages: number
        }
    }
}
export const users_reservations = createQueryFactory<users_reservations_interface>("/api/users/reservations");

export interface users_notifications_checkUnread_interface {
  hasUnreadNotifications: boolean;
}
export const users_notifications_checkUnread = createQueryFactory<users_notifications_checkUnread_interface>(
  "/api/users/notifications/check-unread"
);

export interface users_home_locations_interface {
  houseInfo: {
    latitude: number;
    longitude: number;
  };
  stationInfo: {
    latitude: number;
    longitude: number;
    name: string;
  };
}
export const users_home_locations = createQueryFactory<users_home_locations_interface>(
  "/api/users/home/locations"
);

export interface users_wallet_balances_interface {
    balance: number
}
export const users_wallet_balances = createQueryFactory<users_wallet_balances_interface>(
    "/api/users/wallet/balance"
)

export interface users_wallet_history_interface {
    histories: {
        content: {
            timeStamp: string
            type: "PAY"  | "REFUND" | "FREE_CHARGE" | "WELCOME_MONEY_CHARGE"
            amountMoney: number
            remainMoney: number
        } []
        ,
        page: {
            size: number
            number: number
            totalElements: number
            totalPages: number
        }
    }
}
export const users_wallet_history = createQueryFactory<users_wallet_history_interface>('/api/users/wallet/history')

export interface users_timetable_interface {
    monStartTime: string | null
    monEndTime: string | null,
    tueStartTime: string | null,
    tueEndTime: string | null,
    wedStartTime: string | null,
    wedEndTime: string | null,
    thuStartTime: string | null,
    thuEndTime: string | null,
    friStartTime: string | null,
    friEndTime: string | null,
}
export const users_timetable = createQueryFactory<users_timetable_interface>("/api/users/timetable")