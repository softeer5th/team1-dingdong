package com.ddbb.dingdong.presentation.endpoint.admin.exchanges;

import lombok.Getter;

import java.util.List;

@Getter
public class CreateRouteRequestDTO {
    List<ClusterInfo> clusters;

    @Getter
    public static class ClusterInfo {
        private String clusterLabel;
    }
}
