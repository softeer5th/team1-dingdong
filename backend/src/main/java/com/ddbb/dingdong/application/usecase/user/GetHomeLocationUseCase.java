package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.user.repository.UserQueryRepository;
import com.ddbb.dingdong.domain.user.repository.UserRepository;
import com.ddbb.dingdong.domain.user.repository.projection.HomeLocationProjection;
import com.ddbb.dingdong.domain.user.service.UserErrors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetHomeLocationUseCase implements UseCase<GetHomeLocationUseCase.Param, GetHomeLocationUseCase.Result> {
    private final UserQueryRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Result execute(Param param) {
        Long userId = param.getUserId();
        HomeLocationProjection projection = userRepository.queryHomeLocationByUserId(userId).orElseThrow(UserErrors.NOT_FOUND::toException);

        return new Result(
                new Result.HouseInfo(projection.getHouseLatitude(), projection.getHouseLongitude()),
                new Result.StationInfo(projection.getStationName(), projection.getStationLatitude(), projection.getStationLongitude())
        );
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private HouseInfo houseInfo;
        private StationInfo stationInfo;

        @Getter
        @AllArgsConstructor
        public static class HouseInfo {
            private Double latitude;
            private Double longitude;
        }
        @Getter
        @AllArgsConstructor
        public static class StationInfo {
            private String name;
            private Double latitude;
            private Double longitude;
        }
    }
}
