package com.ddbb.dingdong.domain.clustering.service;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.repository.LocationRepository;
import com.ddbb.dingdong.domain.clustering.service.error.ClusterErrors;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.infrastructure.clustering.ElkiCluster;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClusteringService {
    private final ElkiCluster elkiCluster;
    private final LocationRepository locationRepository;

    public void cluster(List<Location> allLocations, Direction direction, LocalDateTime dingdongTime) {
        String labelPrefix = direction.name() + "_" + dingdongTime + "_";
        List<Location> clusters = elkiCluster.elkiDBScan(allLocations,3, 2, labelPrefix);
        locationRepository.saveAll(clusters);
    }

    public List<Location> findByClusterLabel(String clusterLabel) {
        List<Location> cluster = locationRepository.findAllByClusterLabel(clusterLabel);
        if(cluster.isEmpty()) {
            throw ClusterErrors.NOT_FOUND.toException();
        }

        return cluster;
    }

    public void saveLocation(Location location) {
        locationRepository.save(location);
    }

}
