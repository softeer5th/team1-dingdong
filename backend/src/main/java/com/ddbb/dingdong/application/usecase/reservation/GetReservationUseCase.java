package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
import com.ddbb.dingdong.domain.reservation.repository.ReservationQueryRepository;
import com.ddbb.dingdong.domain.reservation.repository.projection.UserReservationProjection;
import com.ddbb.dingdong.domain.reservation.service.error.ReservationErrors;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GetReservationUseCase implements UseCase<GetReservationUseCase.Param, GetReservationUseCase.Result> {
    private final ReservationQueryRepository reservationQueryRepository;

    @Override
    public Result execute(Param param) {
        Long userId = param.userId;
        Long reservationId = param.reservationId;

        UserReservationProjection projection = reservationQueryRepository.queryReservationByReservationIdAndUserId(reservationId, userId)
                .orElseThrow(ReservationErrors.NOT_FOUND::toException);

        String busStopName = projection.getBusStopRoadNameAddress() == null ? projection.getUserHomeStationName() : projection.getBusStopRoadNameAddress();
        LocalDateTime expectedArrivalTime = projection.getExpectedArrivalTime();
        LocalDateTime expectedDepartureTime = projection.getExpectedDepartureTime();
        Result.ReservationInfo.OperationInfo operationInfo = null;
        if(ReservationStatus.ALLOCATED.equals(projection.getReservationStatus())) {
             operationInfo = new Result.ReservationInfo.OperationInfo(
                    projection.getBusScheduleId(),
                     projection.getBusStatus(),
                    "버스 " + String.format("%02d", projection.getBusScheduleId()),
                    projection.getBusStopArrivalTime()
            );
            expectedDepartureTime = projection.getRealDepartureTime();
            expectedArrivalTime = projection.getRealArrivalTime();
        }

        return new Result(
                new Result.ReservationInfo(
                        projection.getReservationId(),
                        projection.getStartDate(),
                        busStopName,
                        projection.getDirection(),
                        expectedArrivalTime,
                        expectedDepartureTime,
                        projection.getReservationStatus(),
                        operationInfo
                )
        );
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private Long reservationId;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private ReservationInfo reservationInfo;

        @Getter
        @AllArgsConstructor
        public static class ReservationInfo {
            private Long reservationId;
            private LocalDate startDate;
            private String busStopName;
            private Direction direction;
            private LocalDateTime expectedArrivalTime;
            private LocalDateTime expectedDepartureTime;
            private ReservationStatus reservationStatus;
            private OperationInfo operationInfo;

            @Getter
            @AllArgsConstructor
            public static class OperationInfo {
                private Long busScheduleId;
                private OperationStatus busStatus;
                private String busName;
                private LocalDateTime busStopArrivalTime;
            }
        }
    }
}
