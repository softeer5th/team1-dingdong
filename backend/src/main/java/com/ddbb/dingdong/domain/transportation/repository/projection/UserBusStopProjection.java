package com.ddbb.dingdong.domain.transportation.repository.projection;

import java.time.LocalDateTime;

public interface UserBusStopProjection {
    Long getUserId();
    Long getReservationId();
    LocalDateTime getBusStopArrivalTime();
    Long getBusStopId();
}
