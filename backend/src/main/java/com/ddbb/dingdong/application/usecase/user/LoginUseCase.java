package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.user.service.UserManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginUseCase implements UseCase<LoginUseCase.Param,Void> {
    private final UserManagement userManagement;

    @Override
    public Void execute(Param param) {
        param.validate();
        String email = param.email;
        String rawPassword = param.rawPassword;
        userManagement.login(email, rawPassword);
        return null;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private String email;
        private String rawPassword;

        @Override
        public boolean validate() {
            if (email.isBlank()) throw UserInvalidParamErrors.REQUIRED_EMAIL.toException();
            if (rawPassword.isBlank()) throw UserInvalidParamErrors.REQUIRED_PASSWORD.toException();

            return true;
        }
    }
}
