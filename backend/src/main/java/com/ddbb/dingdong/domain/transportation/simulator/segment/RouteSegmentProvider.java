package com.ddbb.dingdong.domain.transportation.simulator.segment;

import com.ddbb.dingdong.domain.transportation.simulator.RouteSegment;

import java.time.LocalDateTime;
import java.util.List;

public interface RouteSegmentProvider {
    List<RouteSegment> getRouteSegments(LocalDateTime startTime);
}
