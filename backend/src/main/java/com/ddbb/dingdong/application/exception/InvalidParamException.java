package com.ddbb.dingdong.application.exception;

public class InvalidParamException extends RuntimeException {
    public InvalidParamErrorInfo error;

    public InvalidParamException(InvalidParamErrorInfo error) {
        this.error = error;
    }
}
