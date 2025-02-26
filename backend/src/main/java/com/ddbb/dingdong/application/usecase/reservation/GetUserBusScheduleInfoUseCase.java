package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.repository.ReservationQueryRepository;
import com.ddbb.dingdong.domain.reservation.repository.projection.UserReservationProjection;
import com.ddbb.dingdong.domain.reservation.service.error.ReservationErrors;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GetUserBusScheduleInfoUseCase implements UseCase<GetUserBusScheduleInfoUseCase.Param, GetUserBusScheduleInfoUseCase.Result> {
    private final ReservationQueryRepository reservationQueryRepository;

    @Override
    public Result execute(Param param) {
        return getUserBusScheduleInfo(param);
    }

    private Result getUserBusScheduleInfo(Param param) {
        Long userId = param.getUserId();
        Long busScheduleId = param.getBusScheduleId();
        UserReservationProjection projection = reservationQueryRepository.queryReservationByBusScheduleIdAndUserId(userId, busScheduleId)
                .orElseThrow(ReservationErrors.BUS_SCHEDULE_NOT_FOUND::toException);

        return new Result(
                projection.getReservationId(),
                projection.getBusStopRoadNameAddress(),
                projection.getDirection(),
                projection.getRealArrivalTime(),
                projection.getRealDepartureTime(),
                new Result.OperationInfo(
                        projection.getBusStatus(),
                        "버스 " + String.format("%02d", projection.getBusScheduleId()),
                        projection.getBusStopArrivalTime()
                )
        );
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private Long busScheduleId;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private Long reservationId;
        private String busStopName;
        private Direction direction;
        private LocalDateTime expectedArrivalTime;
        private LocalDateTime expectedDepartureTime;
        private OperationInfo operationInfo;

        @Getter
        @AllArgsConstructor
        public static class OperationInfo {
            private OperationStatus busStatus;
            private String busName;
            private LocalDateTime busStopArrivalTime;
        }
    }
}
