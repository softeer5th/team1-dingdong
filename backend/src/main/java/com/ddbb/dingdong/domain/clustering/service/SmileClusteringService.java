package com.ddbb.dingdong.domain.clustering.service;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.repository.LocationRepository;
import com.ddbb.dingdong.domain.clustering.util.HaversineDistanceFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import smile.clustering.KMeans;

import java.util.List;

@Service
public class SmileClusteringService {

    private final LocationRepository locationRepository;
    private final HaversineDistanceFunction haversineDistanceFunction;

    private static final Logger logger = LoggerFactory.getLogger(SmileClusteringService.class);

    public SmileClusteringService(
            LocationRepository locationRepository,
            HaversineDistanceFunction haversineDistanceFunction
    ) {
        this.locationRepository = locationRepository;
        this.haversineDistanceFunction = haversineDistanceFunction;
    }

    public void smileKmeans(int k) {
        // 1) DB에서 모든 location 데이터 읽어오기
        List<Location> allLocations = locationRepository.findAll();
        if (allLocations.isEmpty()) return;

        // 2) double[][] 형태로 (위도, 경도) 좌표 추출
        double[][] data = getAllLocations(allLocations);

        // 3) Smile K-Means 수행 (k개의 클러스터)
        KMeans kmeans = KMeans.fit(data, k);
        int[] labels = kmeans.y; // 각 점의 클러스터 라벨 배열

        // 4) 라벨 정보 DB에 업데이트
        saveResults(allLocations, labels);

        // 필요하다면 중심점(centroids)도 활용 가능
        double[][] centroids = kmeans.centroids;
    }

    public void smileDBScan(double radius, int minPts) {
        // DB에서 모든 location 데이터 읽어오기
        List<Location> allLocations = locationRepository.findAll();
        if (allLocations.isEmpty()) return;

        // double[][] 형태로 (위도, 경도) 좌표 추출
        double[][] data = getAllLocations(allLocations);

        // DBSCAN 파라미터: Default eps=3.0 (3km), minPts=2
        smile.clustering.DBSCAN<double[]> dbscan = smile.clustering.DBSCAN.fit(data, haversineDistanceFunction, minPts, radius);

        // 각 포인트의 클러스터 라벨
        // -1이면 noise
        int[] labels = dbscan.y;

        // DB에 반영
        saveResults(allLocations, labels);

    }

    private double[][] getAllLocations(List<Location> allLocations) {
        // ELKI DB에 저장할 double[][] 데이터 초기화
        double[][] data = new double[allLocations.size()][2];
        for (int i = 0; i < allLocations.size(); i++) {
            Location loc = allLocations.get(i);
            data[i][0] = loc.getLatitude();
            data[i][1] = loc.getLongitude();
        }

        return data;
    }


    private void saveResults(List<Location> allLocations, int[] labels) {
        for (int i = 0; i < allLocations.size(); i++) {
            allLocations.get(i).setClusterLabel(labels[i] == Integer.MAX_VALUE ? -1 : labels[i]);
        }
        locationRepository.saveAll(allLocations);
    }

}
