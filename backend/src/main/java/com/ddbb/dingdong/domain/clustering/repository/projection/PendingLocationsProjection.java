package com.ddbb.dingdong.domain.clustering.repository.projection;

public interface PendingLocationsProjection {
    String getClusterLabel();
    Double getLatitude();
    Double getLongitude();
}
