package com.ddbb.dingdong.infrastructure.bus.simulator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.ddbb.dingdong.infrastructure.bus.simulator.subscription.source.BusSimulator;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import com.ddbb.dingdong.infrastructure.bus.simulator.segment.RouteSegmentProvider;
import com.ddbb.dingdong.util.GeoUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BusSimulatorFactory {
    private final RouteSegmentProvider segmentProvider;
    private static final double UNIT_SECOND = 1.0;

    /**
     * @param busId : 출발할 버스 아이디
     * 주어진 Segment 리스트를 기반으로 정해진 UNIT_SECOND 마다의 버스 위치를 계산하여
     * 각 단위초마다 버스 위치를 시뮬레이트 하는 BusSimulator를 만듭니다.
     * **/
    public BusSimulator create(Long busId) {
        List<RouteSegment> segments = segmentProvider.getRouteSegments(busId);
        double deltaTime = UNIT_SECOND;

        List<Point> simulatedPoints = new ArrayList<>();
        Point currentPoint = segments.get(0).points().get(0);
        simulatedPoints.add(currentPoint);

        for (RouteSegment segment : segments) {
            final double avgSpeedPerSegment = (double)segment.distance() / segment.time();

            for (int i = 1; i < segment.points().size(); i++) {
                Point s = segment.points().get(i - 1), e = segment.points().get(i);

                final double edgeDist = GeoUtil.haversine(s.getY(), s.getX(), e.getY(), e.getX());
                final double edgeTime = edgeDist / avgSpeedPerSegment;
                final double normX = (e.getX() - s.getX()) / edgeDist;
                final double normY = (e.getY() - s.getY()) / edgeDist;
                final Point velocity = new Point(normX * avgSpeedPerSegment, normY * avgSpeedPerSegment);

                double timeOnEdge = 0.0;

                while (edgeTime > (timeOnEdge + deltaTime)) {
                    double newX = currentPoint.getX() + velocity.getX() * deltaTime;
                    double newY = currentPoint.getY() + velocity.getY() * deltaTime;
                    currentPoint = new Point(newX, newY);
                    simulatedPoints.add(currentPoint);

                    timeOnEdge += deltaTime;
                    deltaTime = UNIT_SECOND;
                }

                deltaTime = (timeOnEdge + deltaTime) - edgeTime;
                currentPoint = e;
            }
        }
        return new BusSimulator(simulatedPoints);
    }
}
