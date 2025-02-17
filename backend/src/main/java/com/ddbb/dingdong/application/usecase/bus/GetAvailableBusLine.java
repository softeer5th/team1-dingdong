package com.ddbb.dingdong.application.usecase.bus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.AvailableBusStopProjection;
import com.ddbb.dingdong.domain.transportation.repository.projection.BusReservedSeatProjection;
import com.ddbb.dingdong.domain.transportation.service.BusStopQueryService;
import com.ddbb.dingdong.domain.user.repository.UserQueryRepository;
import com.ddbb.dingdong.domain.user.repository.projection.HomeStationProjection;
import com.ddbb.dingdong.domain.user.service.error.UserErrors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAvailableBusLine implements UseCase<GetAvailableBusLine.Param, GetAvailableBusLine.Response> {
    private final BusScheduleQueryRepository busScheduleQueryRepository;
    private final UserQueryRepository userQueryRepository;
    private final BusStopQueryService busStopQueryService;

    @Override
    public Response execute(Param param) {
        HomeStationProjection homeStation = userQueryRepository.findHomeStationLocationWithSchoolId(param.userId)
                .orElseThrow(UserErrors.NOT_FOUND::toException);
        List<AvailableBusStopProjection> busStops = busStopQueryService.findAvailableBusStops(
                homeStation.getSchoolId(),
                param.direction,
                param.time,
                homeStation.getStationLongitude(),
                homeStation.getStationLatitude()
        );
        List<Long> busIds = busStops.stream().map(AvailableBusStopProjection::getBusScheduleId).toList();
        Map<Long, Long> reservedCount = busScheduleQueryRepository.findReservedSeatCount(busIds)
                .stream()
                .collect(Collectors.toMap(BusReservedSeatProjection::getBusScheduleId, BusReservedSeatProjection::getReservedSeatCount));

        List<Response.Item> items = busStops.stream().map(busStop -> {
            int count = Math.toIntExact(reservedCount.get(busStop.getBusScheduleId()));
            Response.BusStopInfo busStopInfo = Response.BusStopInfo.builder()
                    .name(busStop.getBusStopName())
                    .time(busStop.getBusStopTime())
                    .latitude(busStop.getLatitude())
                    .longitude(busStop.getLongitude())
                    .build();
            Response.BusInfo busInfo = Response.BusInfo.builder()
                    .name(busStop.getBusName())
                    .reservedSeat(count)
                    .totalSeat(15)
                    .build();
            return new Response.Item(busStop.getBusScheduleId(), busStop.getBusStopId(), busStopInfo, busInfo);
        })
        .toList();
        return new Response(items);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private LocalDateTime time;
        private Direction direction;
    }

    @Getter
    @AllArgsConstructor
    public static class Response {
        private List<Item> result;

        @Getter
        @AllArgsConstructor
        public static class Item {
            private Long busScheduleId;
            private Long busStopId;
            private BusStopInfo busStop;
            private BusInfo busInfo;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        public static class BusStopInfo {
            private String name;
            private LocalDateTime time;
            private Double longitude;
            private Double latitude;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        public static class BusInfo {
            private String name;
            private int reservedSeat;
            private int totalSeat;
        }
    }
}
