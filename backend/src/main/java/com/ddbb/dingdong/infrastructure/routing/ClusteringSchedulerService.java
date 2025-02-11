//package com.ddbb.dingdong.domain.clustering.service;
//
//import com.ddbb.dingdong.domain.clustering.entity.Location;
//import com.ddbb.dingdong.infrastructure.clustering.ClusteringUtil;
//import com.ddbb.dingdong.domain.transportation.entity.Path;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.concurrent.CompletableFuture;
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class ClusteringSchedulerService {
//
//    private final ElkiClusteringService elkiClusteringService;
//    private final BusRouteCreationService busRouteCreationService;
//
//    @Scheduled(cron = "0 0/30 9-17 * * SUN,MON,TUE,WED,SAT")
//    public void scheduleClustering() {
//        LocalDateTime now = LocalDateTime.now();
//        log.info("Clustering scheduler start, {}시 {}분", now.getHour(), now.getMinute());
//
//        List<Location> locations = elkiClusteringService.elkiDBScan(3, 2);
//        List<List<Location>> clusters = ClusteringUtil.generateClusters(locations);
//        List<CompletableFuture<Path>> futureResponses = new ArrayList<>();
//        List<Path> results;
//        int executorSize = clusters.size();
//        ExecutorService executor = Executors.newFixedThreadPool(executorSize);
//
//        for (int i = 0; i < executorSize; i++) {
//            futureResponses.add(runSingleRouteOptimization(clusters.get(i), executor));
//        }
//
//        results = futureResponses.stream().map(CompletableFuture::join).toList();
//
//        if (results.isEmpty()) {
//            log.error("Clustering scheduler error, no results found");
//        } else if (results.size() != executorSize) {
//            log.error("Some results found, but only {} results found", results.subList(0, results.indexOf(null)).size());
//        } else {
//            log.info("Clustering scheduler success, {}", results.size());
//        }
//
//        log.info("Clustering scheduler end");
//    }
//
//    private CompletableFuture<Path> runSingleRouteOptimization(List<Location> cluster, ExecutorService executor) {
//        return CompletableFuture.supplyAsync(() -> busRouteCreationService., executor)
//                .exceptionally(throwable -> {
//                    log.error(throwable.getMessage(), throwable);
//                    return null;
//                });
//    }
//}
