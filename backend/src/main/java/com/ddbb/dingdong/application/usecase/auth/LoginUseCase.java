package com.ddbb.dingdong.application.usecase.auth;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.usecase.auth.errors.AuthInvalidParamErrors;
import com.ddbb.dingdong.domain.auth.service.AuthManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginUseCase implements UseCase<LoginUseCase.Param,Void> {
    private final AuthManagement authManagement;

    @Override
    public Void execute(Param param) {
        param.validate();
        String email = param.email;
        String rawPassword = param.rawPassword;
        authManagement.login(email, rawPassword);
        return null;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private String email;
        private String rawPassword;

        @Override
        public boolean validate() {
            if (email.isBlank()) throw AuthInvalidParamErrors.EMAIL_REQUIRED.toException();
            if (rawPassword.isBlank()) throw AuthInvalidParamErrors.PASSWORD_REQUIRED.toException();

            return true;
        }
    }
}
