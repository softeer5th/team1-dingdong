package com.ddbb.dingdong.domain.reservation.service.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AllocationSuccessEvent {
    private Long reservationId;
}
