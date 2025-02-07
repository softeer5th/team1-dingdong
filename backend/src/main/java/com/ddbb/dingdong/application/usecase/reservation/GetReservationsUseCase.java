package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
import com.ddbb.dingdong.domain.reservation.repository.ReservationQueryRepository;
import com.ddbb.dingdong.domain.reservation.repository.projection.UserReservationProjection;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.ReservationCategory;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.SortType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
            case ALLOCATION_SUCCESS -> 1;
            case ALLOCATION_PENDING -> 2;
            case ALLOCATION_FAILED -> 3;
            case OPERATION_FINISHED -> 4;
            case CANCELED -> 5;
        };
        int sort = switch (param.sort) {
            case LATEST -> 0;
            case OLDEST -> 1;
        };
        Page<UserReservationProjection> result = reservationRepository.findFlatReservationsByUserId(param.getUserId(), category, sort, param.pageable);
        List<Result.ReservationInfo> reservationInfos = result.stream()
                .map(r -> {
                    Result.ReservationInfo.OperationInfo operationInfo = null;
                    if(ReservationStatus.ALLOCATED.name().equals(r.getReservationStatus())) {
                        operationInfo = new Result.ReservationInfo.OperationInfo(
                                r.getBusStatus(),
                                r.getBusName(),
                                r.getBusStopArrivalTime(),
                                r.getTotalMinutes()
                        );
                    }
                    String busStopName = r.getBusStopRoadNameAddress() == null ? r.getUserHomeStationName() : r.getBusStopRoadNameAddress();
                    return new Result.ReservationInfo(
                            r.getReservationId(),
                            r.getStartDate(),
                            busStopName,
                            r.getDirection(),
                            r.getExpectedArrivalTime(),
                            r.getReservationStatus(),
                            operationInfo
                    );
                })
                .toList();

        return new Result(new PageImpl<>(reservationInfos, param.pageable, result.getTotalElements()));
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
        private Page<ReservationInfo> reservationInfos;

        @Getter
        @AllArgsConstructor
        public static class ReservationInfo {
            private Long reservationId;
            private LocalDate startDate;
            private String busStopName;
            private String direction;
            private LocalDateTime expectedArrivalTime;
            private String reservationStatus;
            private OperationInfo operationInfo;

            @Getter
            @AllArgsConstructor
            public static class OperationInfo {
                private String busStatus;
                private String busName;
                private LocalDateTime busStopArrivalTime;
                private Integer totalMinutes;
            }
        }
    }
}
