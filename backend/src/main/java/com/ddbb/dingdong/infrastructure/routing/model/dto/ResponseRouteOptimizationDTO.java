package com.ddbb.dingdong.infrastructure.routing.model.dto;

import com.ddbb.dingdong.infrastructure.routing.model.Coordinate;
import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.List;

@Data
public class ResponseRouteOptimizationDTO {
    private List<Feature> features;
    private String type;
    private ResponseRouteOptimizationDTOProperties properties;

    @Data
    public static class Feature {
        private Geometry geometry;
        private FeatureType type;
        private FeatureProperties properties;

        @Data
        public static class Geometry {
            private GeometryType type;
            private List<Coordinate> coordinates;

            public enum GeometryType {
                @SerializedName("LineString")
                LINE_STRING,
                @SerializedName("Point")
                POINT;
            }
        }

        public enum FeatureType {
            @SerializedName("Feature")
            FEATURE;
        }

        @Data
        public static class FeatureProperties {
            private String arriveTime;
            private String distance;
            private String deliveryTime;
            private String viaPointId;
            private String index;
            private String completeTime;
            private String pointType;
            private String waitTime;
            private String viaPointName;
            private String viaDetailAddress;
            private String groupKey;
            private String fare;
            private String time;
            private String poiId;
        }
    }


    @Data
    public static class ResponseRouteOptimizationDTOProperties {
        private String totalFare;
        private String totalTime;
        private String totalDistance;
    }
}
