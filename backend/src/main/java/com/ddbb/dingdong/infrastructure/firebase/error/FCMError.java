package com.ddbb.dingdong.infrastructure.firebase.error;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;

public enum FCMError implements ErrorInfo {
    TOKEN_EXPIRED("토큰이 만료되었습니다."),
    TOKEN_DELETE_FAIL("토큰 삭제에 실패했습니다."),
    TOKEN_ENROLL_ERROR("토큰 등록에 실패하였습니다.")
    ;

    private String desc;
    FCMError(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
