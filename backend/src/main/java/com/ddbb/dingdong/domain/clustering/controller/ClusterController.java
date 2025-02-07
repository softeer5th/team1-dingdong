package com.ddbb.dingdong.domain.clustering.controller;

import com.ddbb.dingdong.domain.clustering.service.ElkiClusteringService;
import com.ddbb.dingdong.domain.clustering.service.SmileClusteringService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cluster")
public class ClusterController {

    private final SmileClusteringService smileClusteringService;
    private final ElkiClusteringService elkiClusteringService;

    public ClusterController(
            SmileClusteringService smileClusteringService,
            ElkiClusteringService elkiClusteringService
    ) {
        this.smileClusteringService = smileClusteringService;
        this.elkiClusteringService = elkiClusteringService;
    }

    @GetMapping("/smile/kmeans")
    public String smileKmeans(@RequestParam(defaultValue = "3") int k) {
        smileClusteringService.smileKmeans(k);
        return "Smile - K-Means 클러스터링 완료! 클러스터 수 = " + k;
    }

    @GetMapping("/smile/dbscan")
    public String smileDBScan(@RequestParam(defaultValue = "3") double radius, @RequestParam(defaultValue = "2") int minPts) {
        smileClusteringService.smileDBScan(radius, minPts);
        return "Smile - DBSCAN 클러스터링 완료! 반경 = " + radius + "km" + ", 최소 점 갯수 = " + minPts;
    }

    @GetMapping("/elki/kmeans")
    public String elkiKmeans(@RequestParam(defaultValue = "3") int k) {
        elkiClusteringService.elkiKmeans(k);
        return "ELKI - K-Means 클러스터링 완료! 클러스터 수 = " + k;
    }

    @GetMapping("/elki/dbscan")
    public String elkiDBScan(@RequestParam(defaultValue = "3") double radius, @RequestParam(defaultValue = "2") int minPts) {
        elkiClusteringService.elkiDBScan(radius, minPts);
        return "ELKI - DBSCAN 클러스터링 완료! 반경 = " + radius + "km" + ", 최소 점 갯수 = " + minPts;
    }
}