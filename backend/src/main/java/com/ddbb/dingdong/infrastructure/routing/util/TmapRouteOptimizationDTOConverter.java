package com.ddbb.dingdong.infrastructure.routing.util;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.infrastructure.routing.model.Coordinate;
import com.ddbb.dingdong.infrastructure.routing.model.dto.RequestRouteOptimizationDTO;
import com.ddbb.dingdong.infrastructure.routing.model.dto.RequestRouteOptimizationDTO.ViaPoint;
import com.ddbb.dingdong.infrastructure.routing.model.dto.ResponseRouteOptimizationDTO;
import com.ddbb.dingdong.domain.transportation.entity.BusStop;
import com.ddbb.dingdong.domain.transportation.entity.Line;
import com.ddbb.dingdong.domain.transportation.entity.Path;
import com.ddbb.dingdong.domain.transportation.entity.Point;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ddbb.dingdong.infrastructure.routing.model.dto.ResponseRouteOptimizationDTO.Feature;
import static com.ddbb.dingdong.infrastructure.routing.model.dto.ResponseRouteOptimizationDTO.Feature.Geometry.GeometryType.LINE_STRING;

@Component
@Primary
@RequiredArgsConstructor
public class TmapRouteOptimizationDTOConverter {

    private static final String DATE_FORMAT = "yyyyMMddHHmmss";
    private static final Double BUS_DISTANCE = 0.05;
    private final HaversineDistanceFunction haversine;

    public RequestRouteOptimizationDTO fromLocations(List<Location> locations, Double schoolLatitude, Double schoolLongitude, Direction direction) {
        String startX, startY, endX, endY;
        List<ViaPoint> viaPoints = new ArrayList<>();
        for (Location location : locations) {
            viaPoints.add(
                    new ViaPoint(
                            location.getId().toString(),
                            Double.toString(location.getLongitude()),
                            Double.toString(location.getLatitude())
                    )
            );
        }
        Optional<ViaPoint> farthestPoint = viaPoints.stream().max((o1, o2) -> {
            double[] point1 = {Double.parseDouble(o1.getViaY()), Double.parseDouble(o1.getViaX())};
            double[] point2 = {Double.parseDouble(o2.getViaY()), Double.parseDouble(o2.getViaX())};
            double[] endPoint = {schoolLatitude, schoolLongitude};

            double point1Distance = haversine.distance(point1, endPoint);
            double point2Distance = haversine.distance(point2, endPoint);

            return Double.compare(point1Distance, point2Distance);

        });

        if(direction.equals(Direction.TO_SCHOOL)) {
            startX = String.valueOf((Double.parseDouble(farthestPoint.get().getViaX()) + BUS_DISTANCE));
            startY = String.valueOf((Double.parseDouble(farthestPoint.get().getViaY()) + BUS_DISTANCE));
            endX = schoolLongitude.toString();
            endY = schoolLatitude.toString();
        } else {
            startX = schoolLongitude.toString();
            startY = schoolLatitude.toString();
            endX = farthestPoint.get().getViaX();
            endY = farthestPoint.get().getViaY();
        }



        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        RequestRouteOptimizationDTO request = new RequestRouteOptimizationDTO(
                startX,
                startY,
                formatter.format(LocalDateTime.now()),
                endX,
                endY,
                viaPoints);
        return request;
    }

    public Path toPath(ResponseRouteOptimizationDTO response) {
        Path path = new Path();
        LocalDateTime now = LocalDateTime.now();

        List<Point> points;
        List<Line> lines = new ArrayList<>();
        List<BusStop> busStops = new ArrayList<>();

        long totalTime = Long.parseLong(response.getProperties().getTotalTime());
        LocalDateTime realStartTime = now.minus(Duration.ofSeconds(totalTime));
        LocalDateTime apiStartTime = LocalDateTime.parse(response.getFeatures().get(0).getProperties().getArriveTime(), DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        Duration difference = Duration.between(apiStartTime, realStartTime).abs();

        int lineSequence = 0;
        int busStopSequence = 0;
        for (Feature feature : response.getFeatures()) {
            Feature.Geometry geometry = feature.getGeometry();
            List<Coordinate> coordinates = geometry.getCoordinates();

            if (geometry.getType().equals(LINE_STRING)) {
                points = new ArrayList<>();
                int pointSequence = 0;
                Line line = new Line();
                line.setSequence(lineSequence++);
                line.setTotalMeters(Integer.parseInt(feature.getProperties().getDistance()));
                line.setTotalSeconds(Integer.parseInt(feature.getProperties().getTime()));
                line.setPoints(points);
                line.setPath(path);
                for (Coordinate coordinate : coordinates) {
                    List<Double> coordinateArray = coordinate.doubleArrayValue;
                    points.add(new Point(
                            null,
                            pointSequence++,
                            coordinateArray.get(1),
                            coordinateArray.get(0),
                            line
                    ));
                }
                lines.add(line);

                LocalDateTime expectedArrivalTime = LocalDateTime.parse(
                                feature.getProperties().getArriveTime(),
                                DateTimeFormatter.ofPattern(DATE_FORMAT))
                        .minus(difference);
                Long locationId = null;
                if(!feature.getProperties().getViaPointId().isEmpty()) {
                    locationId = Long.parseLong(feature.getProperties().getViaPointId());
                }
                busStops.add(new BusStop(
                            null,
                            null,
                            busStopSequence++,
                            coordinates.get(0).doubleArrayValue.get(1),
                            coordinates.get(0).doubleArrayValue.get(0),
                            expectedArrivalTime,
                            locationId,
                            path
                ));

            }
        }
        path.setTotalDistance(Double.parseDouble(response.getProperties().getTotalDistance()));
        path.setTotalMinutes(Integer.parseInt(response.getProperties().getTotalTime()));
        path.setLines(lines);
        path.setBusStop(busStops);
        return path;
    }
}
