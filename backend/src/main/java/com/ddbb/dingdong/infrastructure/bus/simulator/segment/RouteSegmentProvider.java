package com.ddbb.dingdong.infrastructure.bus.simulator.segment;

import com.ddbb.dingdong.infrastructure.bus.simulator.RouteSegment;

import java.util.List;

public interface RouteSegmentProvider {
    List<RouteSegment> getRouteSegments(Long busId);
}
