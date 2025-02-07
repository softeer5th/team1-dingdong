package com.ddbb.dingdong.domain.reservation.repository.projection;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface UserReservationProjection {
    Long getReservationId();
    LocalDate getStartDate();
    String getBusStopRoadNameAddress();
    String getUserHomeStationName();
    String getDirection();
    LocalDateTime getExpectedArrivalTime();
    String getReservationStatus();
    String getBusStatus();
    String getBusName();
    LocalDateTime getBusStopArrivalTime();
    Integer getTotalMinutes();
}
