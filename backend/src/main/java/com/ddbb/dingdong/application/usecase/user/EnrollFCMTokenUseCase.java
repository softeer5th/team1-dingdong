package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.firebase.FCMTokenManagement;
import com.ddbb.dingdong.infrastructure.firebase.error.FCMException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrollFCMTokenUseCase implements UseCase<EnrollFCMTokenUseCase.Param, Void> {
    private final FCMTokenManagement tokenManagement;

    @Override
    public Void execute(Param param) {
        try {
            tokenManagement.saveToken(param.userId, param.token);
            return null;
        } catch (FCMException e) {
            throw new DomainException(e.getFcmError());
        }
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private String token;
    }
}
