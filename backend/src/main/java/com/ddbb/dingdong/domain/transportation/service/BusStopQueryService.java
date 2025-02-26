package com.ddbb.dingdong.domain.transportation.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.transportation.repository.BusStopQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.AllAvailableBusStopProjection;
import com.ddbb.dingdong.domain.transportation.repository.projection.AvailableBusStopProjection;
import com.ddbb.dingdong.infrastructure.util.GeoUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BusStopQueryService {
    private static final int THRESHOLD_METER = 5000;

    public record AvailableBusStopDistance(AvailableBusStopProjection busStop, double distance) { }

    private final BusStopQueryRepository busStopQueryRepository;

    public List<AvailableBusStopProjection> findAvailableBusStops(
            Long schoolId, Direction direction, LocalDateTime time, Double longitude, Double latitude,
            Set<LocalDateTime> alreadyReserved
    ) {
        List<AvailableBusStopProjection> projections = busStopQueryRepository.findAvailableBusStop(
                direction, time, schoolId
        );
        return projections.stream()
                .filter(projection ->
                        projection.getLocationId() != null && !alreadyReserved.contains(projection.getBusStopTime()))
                .map(projection -> {
                    double distance = GeoUtil.haversine(latitude, longitude, projection.getLatitude(), projection.getLongitude());
                    return new AvailableBusStopDistance(projection, distance);
                })
                .filter(item -> item.distance() <= THRESHOLD_METER)
                .collect(Collectors.groupingBy(
                        item -> item.busStop().getBusScheduleId(),
                        Collectors.minBy(Comparator.comparingDouble(AvailableBusStopDistance::distance))
                ))
                .values()
                .stream()
                .filter(Optional::isPresent)
                .map(item -> item.get().busStop())
                .toList();
    }

    public List<LocalDateTime> findAllAvailableBusStopTimes(
            Direction direction, Long schoolId, double longitude, double latitude,
            Set<LocalDateTime> alreadyReserved
    ) {
        List<AllAvailableBusStopProjection> items = busStopQueryRepository.findAllAvailableBusStop(direction, schoolId);
        return items.stream()
                .filter(projection ->
                    projection.getLocationId() != null && !alreadyReserved.contains(projection.getBusScheduleTime()))
                .filter(item -> {
                    double distance = GeoUtil.haversine(latitude, longitude, item.getLatitude(), item.getLongitude());
                    return distance <= THRESHOLD_METER;
                })
                .map(AllAvailableBusStopProjection::getBusScheduleTime)
                .collect(Collectors.toCollection(TreeSet::new))
                .stream().toList();

    }
}
