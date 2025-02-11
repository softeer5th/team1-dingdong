package com.ddbb.dingdong.application.usecase.reservation.error;

import com.ddbb.dingdong.application.exception.InvalidParamErrorInfo;

public enum ReservationInvalidParamErrors implements InvalidParamErrorInfo {
    INVALID_DIRECTION("운행 방향이 올바르게 지정 되지 않았습니다.", "direction"),
    INVALID_DATE("예약 시간의 형식이 올바르지 않습니다.","date"),
    ;

    private final String desc;
    private final String field;

    ReservationInvalidParamErrors(String desc, String field) {
        this.desc = desc;
        this.field = field;
    }
    @Override
    public String getDesc() {
        return desc;
    }

    @Override
    public String getField() {
        return field;
    }
}
