package com.ddbb.dingdong.domain.reservation.service;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;

public enum ReservationErrors implements ErrorInfo {
    EXPIRED_RESERVATION_DATE("해당 예약시간이 이미 마감되었습니다."),
    EXCEEDED_RESERVATION_DATE("예약 가능 기간을 초과하였습니다."),
    NOT_SUPPORTED_RESERVATION_TIME("해당 예약 기간은 존재하지 않습니다"),

    NOT_FOUND("해당 예매를 찾을 수 없습니다."),

    INVALID_BUS_TICKET("유효하지 않은 버스 배차입니다."),
    INVALID_RESERVATION_TYPE("유효 하지 않은 예매 타입입니다."),

    CANCELLATION_NOT_ALLOWED("배차 대기인 상태에서만 예매를 취소할 수 있습니다."),
    ALLOCATION_NOT_ALLOWED("배차 대기인 상태에서만 버스를 배차시킬 수 있습니다."),
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
