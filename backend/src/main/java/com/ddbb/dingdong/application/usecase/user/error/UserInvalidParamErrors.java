package com.ddbb.dingdong.application.usecase.user.error;

import com.ddbb.dingdong.application.exception.InvalidParamErrorInfo;

public enum UserInvalidParamErrors implements InvalidParamErrorInfo {
    REQUIRED_STATION_NAME("승하차지 이름이 설정되지 않았습니다", "stationName"),
    REQUIRED_STATION_ROAD_ADDRESS_NAME("승하차지 도로명 주소가 설정되지 않았습니다","roadAddressName"),
    INVALID_STATION_LATITUDE_RANGE("위도 값은 -90.0 ~ 90.0 사이여야 합니다.", "latitude"),
    INVALID_STATION_LONGITUDE_RANGE("경도 값은 -180.0 ~ 180.0 사이여야 합니다.","longitude"),
    INVALID_TIMETABLE_MINUTES("등교 하교시간은 0분 또는 30분만 입력할 수 있습니다.", "timetable"),
    TIMETABLE_FINISH_BEFORE_START("하교 시간은 등교 시간보다 늦을 수 없습니다.", "timetable"),
    ;

    private final String desc;
    private final String field;

    UserInvalidParamErrors(String desc, String field) {
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
