package com.ddbb.dingdong.domain.reservation.service.event;

import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AllocationFailedEvent {
    private Long userId;
    private ReservationInfo reservationInfo;
    private LocalDateTime timestamp;

    @Getter
    @AllArgsConstructor
    public static class ReservationInfo {
        private Long reservationId;
        private Direction direction;
        private LocalDateTime dingdongTime;
        private LocalDate startDate;
    }
}
