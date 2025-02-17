package com.ddbb.dingdong.infrastructure.notification;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class NotificationMessageFormatter {
    public NotificationMessage allocateSuccess() {
        return NotificationMessage.ALLOCATE_SUCCESS;
    }
    public NotificationMessage allocateFail() {
        return NotificationMessage.ALLOCATE_FAIL;
    }
    public NotificationMessage busDeparture(LocalDateTime arrivalTime, LocalDateTime now) {
        long totalSecond = Duration.between(arrivalTime, now).toSeconds();
        long second = totalSecond % 60;
        long totalMinute = totalSecond / 60;
        long minute = totalMinute % 60;
        long totalHour = totalMinute / 60;
        long hour = totalHour % 24;
        StringBuilder content = new StringBuilder().append("버스가 ");
        if (hour > 0) {
            content.append(hour).append("시간 ");
        }
        if (minute > 0) {
            content.append(minute).append("분 ");
        }
        if (second > 0) {
            content.append(second).append("초 ");
        }
        if (totalSecond > 0) {
            content.append("후 도착할 예정입니다.");
        } else {
            content.append("곧 도착할 예정입니다.");
        }
        return new NotificationMessage("버스 출발 알림", content.toString());
    }
}
