package com.ddbb.dingdong.infrastructure.notification;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class NotificationMessageFormatter {
    @Value("${fcm.message.allocate.success.title}")
    private String ALLOCATE_SUCCESS_TITLE;
    @Value("${fcm.message.allocate.success.content}")
    private String ALLOCATE_SUCCESS_CONTENT;
    @Value("${fcm.message.allocate.fail.title}")
    private String ALLOCATE_FAIL_TITLE;
    @Value("${fcm.message.allocate.fail.content}")
    private String ALLOCATE_FAIL_CONTENT;
    @Value("${fcm.message.bus.start.title}")
    private String BUS_START_TITLE;

    private NotificationMessage ALLOCATE_SUCCESS;
    private NotificationMessage ALLOCATE_FAIL;

    @PostConstruct
    public void init() {
        this.ALLOCATE_SUCCESS = new NotificationMessage(ALLOCATE_SUCCESS_TITLE, ALLOCATE_SUCCESS_CONTENT);
        this.ALLOCATE_FAIL = new NotificationMessage(ALLOCATE_FAIL_TITLE, ALLOCATE_FAIL_CONTENT);
    }

    public NotificationMessage allocateSuccess() {
        return ALLOCATE_SUCCESS;
    }
    public NotificationMessage allocateFail() {
        return ALLOCATE_FAIL;
    }

    public NotificationMessage busDeparture(LocalDateTime arrivalTime, LocalDateTime now) {
        long totalSecond = Duration.between(now, arrivalTime).toSeconds();
        long totalMinute = totalSecond / 60;
        long minute = totalMinute % 60;
        long totalHour = totalMinute / 60;
        long hour = totalHour % 24;
        long day = totalHour / 24;
        StringBuilder content = new StringBuilder().append("버스가 ");
        if (hour > 0) {
            content.append(hour).append("시간 ");
        }
        if (day > 0) {
            content.append(day).append("일 ");
        }
        if (minute > 0) {
            content.append(minute).append("분 ");
        }
        if (totalSecond >= 60) {
            content.append("후 도착할 예정입니다.");
        } else {
            content.append("곧 도착할 예정입니다.");
        }
        return new NotificationMessage(BUS_START_TITLE, content.toString());
    }
}
