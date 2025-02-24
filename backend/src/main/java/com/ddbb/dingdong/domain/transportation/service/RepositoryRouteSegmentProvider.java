package com.ddbb.dingdong.domain.transportation.service;

import com.ddbb.dingdong.domain.transportation.repository.PathQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.PathSegmentProjection;
import com.ddbb.dingdong.infrastructure.bus.simulator.RouteSegment;
import com.ddbb.dingdong.infrastructure.bus.simulator.segment.RouteSegmentProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@Primary
@RequiredArgsConstructor
public class RepositoryRouteSegmentProvider implements RouteSegmentProvider {
    private final PathQueryRepository pathQueryRepository;

    @Override
    public List<RouteSegment> getRouteSegments(Long busScheduleId) {
        List<PathSegmentProjection> projections = pathQueryRepository.findSegmentByBusScheduleId(busScheduleId);

        return projections.stream()
                .collect(Collectors.groupingBy(
                        PathSegmentProjection::getLineId,
                        TreeMap::new,
                        Collectors.toList()
                ))
                .values()
                .stream()
                .map(segmentList -> {
                    PathSegmentProjection head = segmentList.get(0);
                    List<Point> points = segmentList.stream()
                            .map(item -> new Point(item.getLongitude(), item.getLatitude()))
                            .toList();
                    return new RouteSegment(points, head.getMeter(), head.getSecond());
                })
                .toList();
    }
}
