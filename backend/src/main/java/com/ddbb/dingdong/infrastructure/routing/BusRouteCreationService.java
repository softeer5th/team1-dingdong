package com.ddbb.dingdong.infrastructure.routing;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.transportation.entity.Path;
import com.ddbb.dingdong.domain.user.entity.School;
import com.ddbb.dingdong.infrastructure.routing.api.TmapRouteOptimizationApiClient;
import com.ddbb.dingdong.infrastructure.routing.model.dto.RequestRouteOptimizationDTO;
import com.ddbb.dingdong.infrastructure.routing.model.dto.ResponseRouteOptimizationDTO;
import com.ddbb.dingdong.infrastructure.routing.util.TmapRouteOptimizationDTOConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BusRouteCreationService {

    private final TmapRouteOptimizationApiClient apiClient;
    private final TmapRouteOptimizationDTOConverter routeOptimizationDTOConverter;

    public Path routeOptimization(List<Location> locations, School school, Direction direction) {
        RequestRouteOptimizationDTO request;
        ResponseRouteOptimizationDTO response;

        request = generateRequests(locations, school, direction);
        response = apiClient.getRouteOptimization(request);

        return routeOptimizationDTOConverter.toPath(response);
    }

    private RequestRouteOptimizationDTO generateRequests(List<Location> locations, School school, Direction direction) {
        RequestRouteOptimizationDTO request;
        request = routeOptimizationDTOConverter.fromLocations(locations, school.getLatitude(), school.getLongitude(),direction);
        return request;
    }
}
