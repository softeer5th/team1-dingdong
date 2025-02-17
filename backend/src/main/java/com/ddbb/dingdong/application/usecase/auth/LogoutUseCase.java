package com.ddbb.dingdong.application.usecase.auth;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.auth.service.AuthManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutUseCase implements UseCase<LogoutUseCase.Param, Void> {

    private final AuthManagement authManagement;

    @Override
    public Void execute(Param param) {
        authManagement.logout(param.userId);
        return null;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
    }
}
