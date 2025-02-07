package com.ddbb.dingdong.domain.common.exception;

public interface ErrorInfo {
    String getDesc();

    default String getMessage() {
        return "[" + getCode() + "] " + getDesc();
    }

    default String getCode() {
        return ((Enum<?>) this).name();
    }

    default DomainException toException() {
        return new DomainException(this);
    }
}
