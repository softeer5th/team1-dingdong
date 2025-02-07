package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.exception.InvalidParamErrorInfo;

public enum UserInvalidParamErrors implements InvalidParamErrorInfo {
    REQUIRED_EMAIL("이메일이 설정되지 않았습니다.", "email"),
    REQUIRED_PASSWORD("비밀번호가 설정되지 않았습니다.", "password"),
    ;

    private final String desc;
    private final String field;

    UserInvalidParamErrors(String desc, String field) {
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
