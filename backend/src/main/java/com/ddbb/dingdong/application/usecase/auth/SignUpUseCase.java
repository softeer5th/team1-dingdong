package com.ddbb.dingdong.application.usecase.auth;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.usecase.auth.errors.AuthInvalidParamErrors;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.infrastructure.auth.security.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.security.AuthenticationManager;
import com.ddbb.dingdong.util.ParamValidator;
import com.ddbb.dingdong.domain.auth.service.AuthManagement;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.presentation.endpoint.auth.exchanges.SignUpRequestDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignUpUseCase implements UseCase<SignUpUseCase.Param, Void> {
    private final AuthManagement authManagement;
    private final AuthenticationManager authenticationManager;

    @Transactional
    @Override
    public Void execute(Param param) throws DomainException {
        param.validate();
        authManagement.checkEmail(param.getEmail());
        authManagement.checkPassword(param.getPassword());
        User newUser = authManagement.signUp(param.getName(), param.getEmail(), param.getPassword(), param.getHome(), param.getSchoolId());
        authenticationManager.setAuthentication(new AuthUser(newUser.getId(), newUser.getSchool().getId(), newUser.getRole()));

        return null;
    }

    @Getter
    @RequiredArgsConstructor
    public static class Param implements Params {
        private final String name;
        private final String email;
        private final String password;
        private final SignUpRequestDto.Home home;
        private final Long schoolId;

        @Override
        public boolean validate() {
            if (!ParamValidator.isValidName(name)) {
                throw AuthInvalidParamErrors.INVALID_NAME.toException();
            } else if (!ParamValidator.isValidEmail(email)) {
                throw AuthInvalidParamErrors.INVALID_EMAIL_FORMAT.toException();
            } else if (!ParamValidator.isValidPassword(password)) {
                throw AuthInvalidParamErrors.INVALID_PASSWORD_FORMAT.toException();
            } else if (!ParamValidator.isValidLatitude(home.getHouseLatitude())) {
                throw AuthInvalidParamErrors.INVALID_HOME_LATITUDE.toException();
            } else if (!ParamValidator.isValidLongitude(home.getHouseLongitude())) {
                throw AuthInvalidParamErrors.INVALID_HOME_LONGITUDE.toException();
            } else if (!ParamValidator.isValidName(home.getHouseRoadNameAddress())) {
                throw AuthInvalidParamErrors.INVALID_ROAD_NAME_ADDRESS.toException();
            } else if (schoolId == null) {
                throw AuthInvalidParamErrors.INVALID_SCHOOL_ID.toException();
            }
            return true;
        }
    }
}
