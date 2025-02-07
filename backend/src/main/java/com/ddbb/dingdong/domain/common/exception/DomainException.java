package com.ddbb.dingdong.domain.common.exception;

public class DomainException extends RuntimeException {
    public ErrorInfo error;

    public DomainException(ErrorInfo error) {
        super(error.getMessage());
        this.error = error;
    }
}
