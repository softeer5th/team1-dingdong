package com.ddbb.dingdong.domain.reservation.service.error;

import com.ddbb.dingdong.domain.common.exception.ErrorInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class DuplicatedReservationErrorInfo implements ErrorInfo {
    private List<LocalDateTime> times;

    @Override
    public String getDesc() {
        StringBuilder desc = new StringBuilder();
        desc.append("다음 시간대에 이미 예약이 존재합니다.\n");
        times.forEach(time -> desc.append(time).append("\n"));
        return desc.toString();
    }

    @Override
    public String getCode() {
        return "ALREADY_HAS_SAME_RESERVATION";
    }
}
