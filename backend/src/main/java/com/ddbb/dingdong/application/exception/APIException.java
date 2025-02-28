package com.ddbb.dingdong.application.exception;

import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.common.exception.ErrorInfo;
import org.springframework.http.HttpStatus;

public class APIException extends RuntimeException {
    public ErrorInfo error;
    public HttpStatus status;

    public APIException(DomainException ex, HttpStatus status) {
        super(ex.error.getMessage());
        this.error = ex.error;
        this.status = status;
    }

    public APIException(Exception ex, HttpStatus status) {
        super(ex.getMessage());
        this.status = status;
    }
}
