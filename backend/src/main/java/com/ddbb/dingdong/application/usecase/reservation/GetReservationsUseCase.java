package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
import com.ddbb.dingdong.domain.reservation.repository.ReservationQueryRepository;
import com.ddbb.dingdong.domain.reservation.repository.projection.UserReservationProjection;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.enums.ReservationCategory;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.enums.SortType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetReservationsUseCase implements UseCase<GetReservationsUseCase.Param, GetReservationsUseCase.Result> {
    private final ReservationQueryRepository  reservationRepository;

    @Transactional
    @Override
    public Result execute(Param param) {
        int category = switch (param.category) {
            case ALL -> 0;
            case ALLOCATED -> 1;
            case PENDING -> 2;
            case FAIL_ALLOCATED -> 3;
            case ENDED -> 4;
            case CANCELED -> 5;
            case HOME -> 6;
        };
        int sort = switch (param.sort) {
            case LATEST -> 0;
            case OLDEST -> 1;
        };
        Page<UserReservationProjection> result = reservationRepository.queryReservationsByUserId(param.getUserId(), category, sort, param.pageable);
        List<Result.ReservationInfo> reservationInfos = result.stream()
                .map(r -> {
                    Result.ReservationInfo.OperationInfo operationInfo = null;
                    LocalDateTime expectedArrivalTime = r.getExpectedArrivalTime();
                    LocalDateTime expectedDepartureTime = r.getExpectedDepartureTime();

                    if(ReservationStatus.ALLOCATED.equals(r.getReservationStatus())) {
                        operationInfo = new Result.ReservationInfo.OperationInfo(
                                r.getBusScheduleId(),
                                r.getBusStatus(),
                                "버스 " + String.format("%02d", r.getBusScheduleId()),
                                r.getBusStopArrivalTime()
                        );
                        expectedDepartureTime = r.getRealDepartureTime();
                        expectedArrivalTime = r.getRealArrivalTime();
                    }
                    String busStopName = r.getBusStopRoadNameAddress() == null ? r.getUserHomeStationName() : r.getBusStopRoadNameAddress();
                    return new Result.ReservationInfo(
                            r.getReservationId(),
                            r.getStartDate(),
                            busStopName,
                            r.getDirection(),
                            expectedArrivalTime,
                            expectedDepartureTime,
                            r.getReservationStatus(),
                            operationInfo
                    );
                })
                .toList();

        return new Result(new PagedModel<>(new PageImpl<>(reservationInfos, param.pageable, result.getTotalElements())));
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private Pageable pageable;
        private SortType sort;
        private ReservationCategory category;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private PagedModel<ReservationInfo> reservationInfos;

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
