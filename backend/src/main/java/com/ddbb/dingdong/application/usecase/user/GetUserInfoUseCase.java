package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.user.repository.UserQueryRepository;
import com.ddbb.dingdong.domain.user.repository.projection.UserStaticOnly;
import com.ddbb.dingdong.domain.user.service.error.UserErrors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetUserInfoUseCase implements UseCase<GetUserInfoUseCase.Param, GetUserInfoUseCase.Result> {
    private final UserQueryRepository userRepository;

    @Override
    public Result execute(Param param) {
        UserStaticOnly staticInfo = userRepository.findUserStaticInfoById(param.getUserId())
                .orElseThrow(() -> new DomainException(UserErrors.NOT_FOUND));

        return Result.builder()
                .email(staticInfo.getEmail())
                .userName(staticInfo.getUserName())
                .schoolName(staticInfo.getSchoolName())
                .schoolLongitude(staticInfo.getSchoolLongitude())
                .schoolLatitude(staticInfo.getSchoolLatitude())
                .build();
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Result {
        private String userName;
        private String email;
        private String schoolName;
        private double schoolLongitude;
        private double schoolLatitude;
    }
}
