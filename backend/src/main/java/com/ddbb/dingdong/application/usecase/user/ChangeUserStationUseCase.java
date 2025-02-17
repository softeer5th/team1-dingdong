package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.usecase.user.error.UserInvalidParamErrors;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.service.UserManagement;
import com.ddbb.dingdong.util.ParamValidator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChangeUserStationUseCase implements UseCase<ChangeUserStationUseCase.Param, Void> {
    private final UserManagement userManagement;

    @Override
    @Transactional
    public Void execute(Param param) {
        param.validate();
        updateStation(param);

        return null;
    }

    private void updateStation(Param param) {
        Long userId = param.getUserId();
        User user = userManagement.load(userId);
        user.updateStation(param.stationName, param.roadAddressName, param.latitude, param.longitude);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private String stationName;
        private String roadAddressName;
        private Double latitude;
        private Double longitude;

        @Override
        public boolean validate() {
            if(roadAddressName == null || roadAddressName.isEmpty()) {
                throw UserInvalidParamErrors.REQUIRED_STATION_ROAD_ADDRESS_NAME.toException();
            }
            if(stationName == null || stationName.isBlank()) {
                throw UserInvalidParamErrors.REQUIRED_STATION_NAME.toException();
            }
            if(!ParamValidator.isValidLatitude(latitude)) {
                throw UserInvalidParamErrors.INVALID_STATION_LATITUDE_RANGE.toException();
            }
            if(!ParamValidator.isValidLongitude(longitude)) {
                throw UserInvalidParamErrors.INVALID_STATION_LONGITUDE_RANGE.toException();
            }

            return true;
        }
    }

}
