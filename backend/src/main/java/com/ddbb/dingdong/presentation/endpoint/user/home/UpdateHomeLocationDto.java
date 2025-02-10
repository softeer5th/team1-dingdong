package com.ddbb.dingdong.presentation.endpoint.user.home;

import lombok.Getter;

@Getter
public class UpdateHomeLocationDto {
    private Double houseLatitude;
    private Double houseLongitude;
    private Double stationLatitude;
    private Double stationLongitude;
    private String stationName;
}
