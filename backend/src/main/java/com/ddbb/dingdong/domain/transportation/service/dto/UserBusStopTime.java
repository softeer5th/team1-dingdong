package com.ddbb.dingdong.domain.transportation.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
public class UserBusStopTime {
    public record UserReservationId(Long userId, Long busStopId) {}

    private Long busStopId;
    private LocalDateTime time;
    private List<UserReservationId> userReservationIds;

    public UserBusStopTime(Long busStopId, LocalDateTime time) {
        this.busStopId = busStopId;
        this.time = time;
        this.userReservationIds = new ArrayList<>();
    }

    public UserBusStopTime ofTime(LocalDateTime time) {
        return new UserBusStopTime(busStopId, time, userReservationIds);
    }

    public void addUserReservation(Long userId, Long reservationId) {
        userReservationIds.add(new UserReservationId(userId, reservationId));
    }
}
