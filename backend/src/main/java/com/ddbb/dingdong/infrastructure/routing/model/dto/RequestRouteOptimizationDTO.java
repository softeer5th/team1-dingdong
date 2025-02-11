package com.ddbb.dingdong.infrastructure.routing.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequestRouteOptimizationDTO {
    private String reqCoordType = "WGS84GEO";
    private String resCoordType = "WGS84GEO";
    private String startName = "출발지";
    private final String startX;
    private final String startY;
    private final String startTime;
    private String endName = "목적지";
    private final String endX;
    private final String endY;
    private String endPoiId;
    private String searchOption;
    private String carType = "3";
    private String truckType = "6";
    private String truckWidth = "208";
    private String truckHeight = "280";
    private String truckWeight = "4074";
    private String truckTotalWeight = "5200";
    private String truckLength = "707";
    private final List<ViaPoint> viaPoints;

    @Data
    @RequiredArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ViaPoint {
        private final String viaPointId;
        private String viaPointName = "test";
        private String viaDetailAddress;
        private final String viaX;
        private final String viaY;
        private String viaPoiId;
        private Long viaTime;
        private String wishStartTime;
        private String wishEndTime;
    }
}


