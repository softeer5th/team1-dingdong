package com.ddbb.dingdong.infrastructure.bus.simulator.segment.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Component;

import com.ddbb.dingdong.infrastructure.bus.simulator.RouteSegment;
import com.ddbb.dingdong.infrastructure.bus.simulator.segment.RouteSegmentProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Component
public class TMapStubRouteSegmentProvider implements RouteSegmentProvider {

    @Override
    public List<RouteSegment> getRouteSegments(Long busId) {
        List<RouteSegment> routeSegments = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode rootNode = objectMapper.readTree(new ClassPathResource("apiExample.json").getInputStream());
            JsonNode features = rootNode.path("features");

            for (JsonNode feature : features) {
                if ("LineString".equals(feature.path("geometry").path("type").asText())) {
                    List<Point> points = new ArrayList<>();
                    JsonNode coordinates = feature.path("geometry").path("coordinates");

                    for (JsonNode coordinate : coordinates) {
                        double x = coordinate.get(0).asDouble();
                        double y = coordinate.get(1).asDouble();
                        points.add(new Point(x, y));
                    }

                    int distance = feature.path("properties").path("distance").asInt();
                    int time = feature.path("properties").path("time").asInt();

                    routeSegments.add(new RouteSegment(points, distance, time));
                }
            }
        } catch (IOException e) {
            log.debug(e.getMessage());
        }
        return routeSegments;
    }
}
