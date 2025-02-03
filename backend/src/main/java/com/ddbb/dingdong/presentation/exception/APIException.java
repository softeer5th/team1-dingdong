package com.ddbb.dingdong.presentation.exception;

public class APIException extends RuntimeException {
    public APIError error;

    public APIException(APIError error) {
        super(error.getMessage());
        this.error = error;
    }
}
