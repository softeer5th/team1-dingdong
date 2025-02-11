package com.ddbb.dingdong.infrastructure.routing.util;

import de.lmu.ifi.dbs.elki.data.NumberVector;
import de.lmu.ifi.dbs.elki.distance.distancefunction.AbstractNumberVectorDistanceFunction;
import org.springframework.stereotype.Component;

@Component
public class HaversineDistanceFunction
        extends AbstractNumberVectorDistanceFunction {

    private static final double R = 6371.0; // 지구 반경(km)

    public double distance(double[] a, double[] b) {
        // a[0] = lat, a[1] = lon, b[0] = lat, b[1] = lon (주솟값 위치는 Service에서 맞춤)
        double lat1 = a[0];
        double lon1 = a[1];
        double lat2 = b[0];
        double lon2 = b[1];
        return haversine(lat1, lon1, lat2, lon2);
    }

    @Override
    public double distance(NumberVector v1, NumberVector v2) {
        double lat1 = v1.doubleValue(0);
        double lon1 = v1.doubleValue(1);
        double lat2 = v2.doubleValue(0);
        double lon2 = v2.doubleValue(1);

        return haversine(lat1, lon1, lat2, lon2);
    }

    // 하버사인 공식
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // km 단위 거리
    }
}