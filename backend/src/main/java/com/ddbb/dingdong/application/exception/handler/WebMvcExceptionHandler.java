package com.ddbb.dingdong.application.exception.handler;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.exception.InvalidParamException;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@RestControllerAdvice
public class WebMvcExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handle(Exception e) {
        if (e instanceof APIException) {
            ErrorResponse response = new ErrorResponse(
                    ((APIException) e).error.getMessage(),
                    LocalDateTime.now()
            );
            return ResponseEntity.status(((APIException) e).status).body(response);
        } else if (e instanceof InvalidParamException) {
            ErrorResponse response = new ErrorResponse(
                    ((InvalidParamException) e).error.getMessage(),
                    LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else if (e instanceof DomainException) {
            ErrorResponse response = new ErrorResponse(
                    ((DomainException) e).error.getMessage(),
                    LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } else {
            ErrorResponse response = new ErrorResponse(
                    "Unknown error",
                    LocalDateTime.now()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    public record ErrorResponse(String message, LocalDateTime timestamp) {}
}
