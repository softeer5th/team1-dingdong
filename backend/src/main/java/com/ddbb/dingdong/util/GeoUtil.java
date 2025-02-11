package com.ddbb.dingdong.util;

public class GeoUtil {
    private static final double EARTH_RADIUS = 6378137.0; // 지구 반경 (m)

    public static double haversine(double startLat, double startLon, double endLat, double endLon) {
        double dLat = Math.toRadians(endLat - startLat); // 위도 차이
        double dLon = Math.toRadians(endLon - startLon); // 경도 차이

        double a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.cos(Math.toRadians(startLat)) * Math.cos(Math.toRadians(endLat)) *
                        Math.pow(Math.sin(dLon / 2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // 거리 (m)
    }
}