package com.ddbb.dingdong.infrastructure.clustering;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.infrastructure.routing.util.HaversineDistanceFunction;
import de.lmu.ifi.dbs.elki.algorithm.clustering.DBSCAN;
import de.lmu.ifi.dbs.elki.algorithm.clustering.kmeans.KMeansLloyd;
import de.lmu.ifi.dbs.elki.algorithm.clustering.kmeans.initialization.RandomUniformGeneratedInitialMeans;
import de.lmu.ifi.dbs.elki.data.Clustering;
import de.lmu.ifi.dbs.elki.data.NumberVector;
import de.lmu.ifi.dbs.elki.data.model.KMeansModel;
import de.lmu.ifi.dbs.elki.data.model.Model;
import de.lmu.ifi.dbs.elki.data.type.TypeUtil;
import de.lmu.ifi.dbs.elki.database.Database;
import de.lmu.ifi.dbs.elki.database.StaticArrayDatabase;
import de.lmu.ifi.dbs.elki.database.ids.DBIDIter;
import de.lmu.ifi.dbs.elki.database.ids.DBIDRange;
import de.lmu.ifi.dbs.elki.database.relation.Relation;
import de.lmu.ifi.dbs.elki.datasource.ArrayAdapterDatabaseConnection;
import de.lmu.ifi.dbs.elki.datasource.DatabaseConnection;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ElkiCluster {

    private final HaversineDistanceFunction haversineDistanceFunction;
    private final RandomUniformGeneratedInitialMeans randomInit; // ELKI K-Means 초기화용

    public List<Location> elkiDBScan(List<Location> allLocations, double radius, int minPts, String labelPrefix) {
        // DB에서 모든 location 데이터 읽어오기
        if (allLocations.isEmpty()) return null;

        // double[][] 형태로 (위도, 경도) 좌표 추출
        double[][] data = getAllLocations(allLocations);

        // ELKI Database 초기화
        Database db = initializeElkiDatabase(data);

        // ELKI DBSCAN에 사용할 매개변수 초기화
        DBSCAN<NumberVector> dbscan = new DBSCAN<>(haversineDistanceFunction, radius, minPts);

        // ELKI DBSCAN 수행 (초기 값: eps = 3.0(3km), minPts = 2)
        Clustering<Model> result = dbscan.run(db);

        saveElkiResults(allLocations, db, result, labelPrefix);

        return allLocations;
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

    private Database initializeElkiDatabase(double[][] data) {
        // ELKI DB 연결
        DatabaseConnection memconn = new ArrayAdapterDatabaseConnection(data);

        // StaticArrayDatabase로 초기화
        Database db = new StaticArrayDatabase(memconn, null);
        db.initialize();

        return db;
    }

    private <T extends Model> void saveElkiResults(List<Location> allLocations, Database db, Clustering<T> result, String labelPrefix) {
        // 각 노드의 결과 라벨 노이즈 값으로 초기화 (노이즈 = -1)
        int[] labels = new int[allLocations.size()];
        for (int i = 0; i < allLocations.size(); i++) {
            labels[i] = -1;
        }

        Relation<NumberVector> relation = db.getRelation(TypeUtil.NUMBER_VECTOR_FIELD);
        DBIDRange ids = (DBIDRange) relation.getDBIDs();

        // 결과 추출
        List<? extends de.lmu.ifi.dbs.elki.data.Cluster<T>> clusters = result.getAllClusters();
        int cid = 0; // 결과에 해당하는 클러스터 ID 부여
        for (de.lmu.ifi.dbs.elki.data.Cluster<T> cluster : clusters) {
            if (!cluster.isNoise()) {
                // internalGetIndex() 사용 시, Offset이 꼬일 수 있으므로 사용하지 말 것
                for (DBIDIter it = cluster.getIDs().iter(); it.valid(); it.advance()) {
                    final int offset = ids.getOffset(it);
                    labels[offset] = cid;
                }
                cid++;
            }
        }

        saveResults(allLocations, labels, labelPrefix);
    }

    public void saveResults(List<Location> allLocations, int[] labels, String labelPrefix) {
        Map<Integer, List<Integer>> clusterGroups = new HashMap<>();

        for (int i = 0; i < labels.length; i++) {
            if (labels[i] == -1) continue;
            clusterGroups.computeIfAbsent(labels[i], k -> new ArrayList<>()).add(i);
        }

        for (Map.Entry<Integer, List<Integer>> entry : clusterGroups.entrySet()) {
            int clusterId = entry.getKey();
            List<Integer> indices = entry.getValue();

            // 15개씩 분할
            List<List<Integer>> subClusters = new ArrayList<>();
            for (int i = 0; i < indices.size(); i += 15) {
                subClusters.add(new ArrayList<>(indices.subList(i, Math.min(i + 15, indices.size()))));
            }

            // 마지막 클러스터 크기가 4 미만이면 조정
            if (subClusters.size() > 1) {
                List<Integer> lastCluster = subClusters.get(subClusters.size() - 1);
                if (lastCluster.size() < 4) {
                    int need = 4 - lastCluster.size(); // 부족한 개수
                    for (int j = subClusters.size() - 2; j >= 0 && need > 0; j--) {
                        List<Integer> prevCluster = subClusters.get(j);
                        while (!prevCluster.isEmpty() && need > 0) {
                            lastCluster.add(prevCluster.remove(prevCluster.size() - 1));
                            need--;
                        }
                    }
                }
            }

            // 클러스터 라벨 할당
            int subClusterNum = 0;
            for (List<Integer> subCluster : subClusters) {
                subClusterNum++;
                String subLabel = labelPrefix + clusterId + "_" + subClusterNum;
                for (int idx : subCluster) {
                    allLocations.get(idx).setClusterLabel(subLabel);
                }
            }
        }
    }
}
