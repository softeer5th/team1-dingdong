package com.ddbb.dingdong.domain.reservation.service;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;

public enum ReservationErrors implements ErrorInfo {
    NOT_FOUND("해당 예매 내역이 존재 하지 않습니다."),
    ALREADY_HAS_SAME_RESERVATION("이미 같은 일정에 대한 예매 내역이 존재합니다."),
    INVALID_ACCESS("해당 예매에 접근 할 수 없습니다."),

    EXPIRED_RESERVATION_DATE("해당 예약시간이 이미 마감되었습니다."),
    EXCEEDED_RESERVATION_DATE("예약 가능 기간을 초과하였습니다."),
    BEFORE_RESERVATION_DATE("예약 가능 기간이 아닙니다."),
    NOT_SUPPORTED_RESERVATION_TIME("해당 예약 시간은 지원하지 않습니다"),

    INVALID_BUS_TICKET("유효하지 않은 버스 티켓입니다."),
    INVALID_BUS_STOP("유효하지 않은 버스 정류장입니다."),
    INVALID_BUS_SCHEDULE("유효하지 않은 버스 배차입니다."),
    BUS_SCHEDULE_NOT_FOUND("해당 버스 배차가 존재하지 않습니다."),
    BUS_STOP_NOT_FOUND("해당 버스 정류장이 존재하지 않습니다."),
    INVALID_RESERVATION_TYPE("유효 하지 않은 예매 타입입니다."),
    INVALID_RESERVATION_STATUS("유효하지 않은 예매 상태입니다."),

    CANCELLATION_NOT_ALLOWED("배차 대기인 상태에서만 예매를 취소할 수 있습니다."),
    ALLOCATION_NOT_ALLOWED("배차 대기인 상태에서만 버스를 배차시킬 수 있습니다."),
    ISSUE_NOT_ALLOWED("배차 완료인 상태에서만 티켓을 발급할 수 있습니다."),

    NOT_SINGLE_RESERVATION_DATES("단일 예약일이 아닙니다."),
    ;

    ReservationErrors(String desc) {
        this.desc = desc;
    }

    private final String desc;

    @Override
    public String getDesc() {
        return desc;
    }
}
