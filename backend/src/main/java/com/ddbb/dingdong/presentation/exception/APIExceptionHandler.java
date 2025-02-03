package com.ddbb.dingdong.presentation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@RestControllerAdvice
public class APIExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(APIException.class)
    public ResponseEntity<?> handleAPIException(APIException e) {
        ErrorResponse response = new ErrorResponse(e.error.getStatus(), e.error.getDesc(), e.error.getCode(), LocalDateTime.now());

        return ResponseEntity.status(e.error.getStatus())
                .body(response);
    }

    record ErrorResponse(HttpStatus status, String desc, String code, LocalDateTime timestamp) {}
}
