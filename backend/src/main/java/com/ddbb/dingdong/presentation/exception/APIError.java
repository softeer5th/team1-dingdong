package com.ddbb.dingdong.presentation.exception;

import org.springframework.http.HttpStatus;

public interface APIError {
    String getDesc();
    HttpStatus getStatus();

    default String getMessage() {
        return "[" + getStatus() + "] " + getDesc() + "(" + getCode() + ")";
    }

    default String getCode() {
        return ((Enum<?>) this).name();
    }

    default APIException toException() {
        return new APIException(this);
    }
}
