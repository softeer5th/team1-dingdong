package com.ddbb.dingdong.application.common;

public interface UseCase<P extends Params, R> {
    R execute(P param);
}