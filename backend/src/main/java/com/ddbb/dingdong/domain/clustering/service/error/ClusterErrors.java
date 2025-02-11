package com.ddbb.dingdong.domain.clustering.service.error;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;

public enum ClusterErrors implements ErrorInfo {
    NOT_FOUND("해당 클러스터를 찾을 수 없습니다."),

    EMPTY_RESERVATIONS("해당 시간대의 예약이 존재하지 않아 클러스터 생성에 실패합니다."),

    UNKNOWN("클러스터 생성에 실패하였습니다"),
    ;

    private final String desc;

    ClusterErrors(String desc) {
        this.desc = desc;
    }

    @Override
    public String getDesc() {
        return desc;
    }
}
