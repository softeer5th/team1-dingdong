package com.ddbb.dingdong.application.exception;

public interface InvalidParamErrorInfo {
    String getDesc();
    String getField();

    default String getCode() {
        return ((Enum<?>) this).name();
    }
    default String getMessage() {
        return "[" + getCode() + "] " + getDesc() + " (" + getField() + ")";
    }

    default InvalidParamException toException() {
        return new InvalidParamException(this);
    }
}
