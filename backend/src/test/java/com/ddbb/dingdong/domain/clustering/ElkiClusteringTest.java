package com.ddbb.dingdong.domain.clustering;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.infrastructure.clustering.ElkiCluster;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

public class ElkiClusteringTest {
    @Test
    public void testSaveResults_SplitLargeClusters() {
        // 32개의 위치 데이터 생성
        List<Location> allLocations = new ArrayList<>();
        for (int i = 0; i < 32; i++) {
            allLocations.add(new Location());
        }

        // 32개가 모두 같은 클러스터 (예: clusterId = 0)
        int[] labels = new int[32];
        Arrays.fill(labels, 0);

        String labelPrefix = "Cluster_";

        ElkiCluster elkiCluster = new ElkiCluster(null, null);
        elkiCluster.saveResults(allLocations, labels, labelPrefix);

        Set<String> uniqueLabels = new HashSet<>();
        Map<String, Integer> labelCount = new HashMap<>();

        for (Location loc : allLocations) {
            String label = loc.getClusterLabel();
            uniqueLabels.add(label);
            labelCount.put(label, labelCount.getOrDefault(label, 0) + 1);
        }

        // 클러스터가 최대 15개씩 나뉘었는지 확인
        assertEquals(3, uniqueLabels.size());
        assertTrue(labelCount.values().stream().allMatch(count -> count <= 15));

        labelCount.forEach((key, value) -> System.out.println(key + ": " + value + " 개"));
    }
}