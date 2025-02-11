package com.ddbb.dingdong.domain.payment.service;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;

public enum PaymentErrors implements ErrorInfo {
    WALLET_NOT_FOUND("해당 유저의 잔고를 확인 할 수 없습니다."),

    INSUFFICIENT_BALANCE("잔고가 부족합니다."),
    ALREADY_REFUNDED("해당 예매는 이미 환불이 처리되었습니다."),
    ;

    private final String desc;

    PaymentErrors(String desc) {
        this.desc = desc;
    }
    @Override
    public String getDesc() {
        return desc;
    }
}
