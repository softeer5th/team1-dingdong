package com.ddbb.dingdong.domain.clustering.service;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.repository.LocationRepository;
import com.ddbb.dingdong.domain.clustering.util.HaversineDistanceFunction;
import de.lmu.ifi.dbs.elki.algorithm.clustering.DBSCAN;
import de.lmu.ifi.dbs.elki.algorithm.clustering.kmeans.KMeansLloyd;
import de.lmu.ifi.dbs.elki.algorithm.clustering.kmeans.initialization.RandomUniformGeneratedInitialMeans;
import de.lmu.ifi.dbs.elki.data.Cluster;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElkiClusteringService {

    private final LocationRepository locationRepository;
    private final HaversineDistanceFunction haversineDistanceFunction;
    private final RandomUniformGeneratedInitialMeans randomInit; // ELKI K-Means 초기화용

    private static final Logger logger = LoggerFactory.getLogger(ElkiClusteringService.class);

    public ElkiClusteringService(
            LocationRepository locationRepository,
            HaversineDistanceFunction haversineDistanceFunction,
            RandomUniformGeneratedInitialMeans randomInit
    ) {
        this.locationRepository = locationRepository;
        this.haversineDistanceFunction = haversineDistanceFunction;
        this.randomInit = randomInit;
    }

    public void elkiKmeans(int k) {
        // DB에서 모든 location 데이터 읽어오기
        List<Location> allLocations = locationRepository.findAll();
        if (allLocations.isEmpty()) return;

        // double[][] 형태로 (위도, 경도) 좌표 추출
        double[][] data = getAllLocations(allLocations);

        // ELKI Database 초기화
        Database db = initializeElkiDatabase(data);

        // ELKI K-Means 수행 (초기 값: k(클러스터 수, 초기값: 3))
        KMeansLloyd<NumberVector> kmeans = new KMeansLloyd<>(haversineDistanceFunction, k, 0, randomInit);

        Clustering<KMeansModel> result = kmeans.run(db);

        saveElkiResults(allLocations, db, result);
    }

    public void elkiDBScan(double radius, int minPts) {
        // DB에서 모든 location 데이터 읽어오기
        List<Location> allLocations = locationRepository.findAll();
        if (allLocations.isEmpty()) return;

        // double[][] 형태로 (위도, 경도) 좌표 추출
        double[][] data = getAllLocations(allLocations);

        // ELKI Database 초기화
        Database db = initializeElkiDatabase(data);

        // ELKI DBSCAN에 사용할 매개변수 초기화
        DBSCAN<NumberVector> dbscan = new DBSCAN<>(haversineDistanceFunction, radius, minPts);

        // ELKI DBSCAN 수행 (초기 값: eps = 3.0(3km), minPts = 2)
        Clustering<Model> result = dbscan.run(db);

        saveElkiResults(allLocations, db, result);
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

    private <T extends Model> void saveElkiResults(List<Location> allLocations, Database db, Clustering<T> result) {
        // 각 노드의 결과 라벨 노이즈 값으로 초기화 (노이즈 = -1)
        int[] labels = new int[allLocations.size()];
        for (int i = 0; i < allLocations.size(); i++) {
            labels[i] = -1;
        }

        Relation<NumberVector> relation = db.getRelation(TypeUtil.NUMBER_VECTOR_FIELD);
        DBIDRange ids = (DBIDRange) relation.getDBIDs();

        // 결과 추출
        List<? extends Cluster<T>> clusters = result.getAllClusters();
        int cid = 0; // 결과에 해당하는 클러스터 ID 부여
        for (Cluster<T> cluster : clusters) {
            if (!cluster.isNoise()) {
                // internalGetIndex() 사용 시, Offset이 꼬일 수 있으므로 사용하지 말 것
                for (DBIDIter it = cluster.getIDs().iter(); it.valid(); it.advance()) {
                    final int offset = ids.getOffset(it);
                    labels[offset] = cid;
                }
                cid++;
            }
        }

        saveResults(allLocations, labels);
    }

    private void saveResults(List<Location> allLocations, int[] labels) {
        for (int i = 0; i < allLocations.size(); i++) {
            allLocations.get(i).setClusterLabel(labels[i] == Integer.MAX_VALUE ? -1 : labels[i]);
        }
        locationRepository.saveAll(allLocations);
    }
}
