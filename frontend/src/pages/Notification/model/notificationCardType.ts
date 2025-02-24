export type NotificationType =
  | "ALLOCATION_SUCCESS"
  | "ALLOCATION_FAILED"
  | "BUS_START"
  | "WELCOME";

export interface ReservationInfo {
  reservationId: number;
  startStationName: string | null; // 배차 실패의 경우 null 가능
  endStationName: string;
  startDate: string; // 2025-02-28 형식
  expectedStartTime: string | null; // ISO date-time
  expectedEndTime: string; // ISO date-time
}

export interface NotificationCardType {
  type: NotificationType;
  timeStamp: string; // ISO date-time
  reservationInfo: ReservationInfo | null;
  read: boolean;
  money: number | null;
}
