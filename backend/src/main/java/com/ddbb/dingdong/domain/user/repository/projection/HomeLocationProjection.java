package com.ddbb.dingdong.domain.user.repository.projection;

public interface HomeLocationProjection {
    Double getHouseLatitude();
    Double getHouseLongitude();
    String getStationName();
    Double getStationLatitude();
    Double getStationLongitude();
}