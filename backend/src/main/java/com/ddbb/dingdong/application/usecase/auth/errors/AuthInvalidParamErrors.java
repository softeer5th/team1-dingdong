package com.ddbb.dingdong.application.usecase.auth.errors;

import com.ddbb.dingdong.application.exception.InvalidParamErrorInfo;

public enum AuthInvalidParamErrors implements InvalidParamErrorInfo {
    INVALID_NAME("이름이 올바르지 않습니다.", "name"),
    USER_NOT_FOUND("해당 유저를 찾을 수 없습니다.", "email"),
    EMAIL_REQUIRED("이메일이 설정되지 않았습니다.", "email"),
    EMAIL_ALREADY_EXISTS("이미 존재하는 이메일입니다.", "email"),
    INVALID_EMAIL_FORMAT("이메일 형식이 올바르지 않습니다.", "email"),
    INVALID_PASSWORD_FORMAT("비밀번호는 8자 이상 20자 이하여야 하며, 대문자, 소문자, 특수문자를 포함해야 합니다.", "password"),
    NOT_MATCHED_PASSWORD("비밀번호가 일치하지 않습니다.", "password"),
    PASSWORD_REQUIRED("비밀번호가 설정되지 않았습니다.", "password"),
    INVALID_STATION_INFO("정류장 정보가 제대로 설정되지 않았습니다.", "home"),
    INVALID_HOME_LATITUDE("집 위도가 올바르지 않습니다.", "home.houseLatitude"),
    INVALID_HOME_LONGITUDE("집 경도가 올바르지 않습니다.", "home.houseLongitude"),
    INVALID_ROAD_NAME_ADDRESS("도로명주소가 올바르지 않습니다.", "home.houseRoadNameAddress"),
    INVALID_SCHOOL_ID("학교 ID값이 올바르지 않습니다.", "schoolId"),
    ;

    private final String desc;
    private final String field;

    AuthInvalidParamErrors(String desc, String field) {
        this.desc = desc;
        this.field = field;
    }

    @Override
    public String getField() {
        return field;
    }

    @Override
    public String getDesc() {
        return desc;
    }

}
