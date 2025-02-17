package com.ddbb.dingdong.domain.user.service.error;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;

public enum UserErrors implements ErrorInfo {
    NOT_FOUND("해당 유저를 찾을 수 없습니다"),
    ;

    private final String desc;

    UserErrors(String desc) {
        this.desc = desc;
    }

    @Override
    public String getDesc() {
        return desc;
    }
}
