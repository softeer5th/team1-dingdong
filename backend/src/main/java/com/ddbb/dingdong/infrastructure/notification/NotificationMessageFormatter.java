package com.ddbb.dingdong.infrastructure.notification;

import org.springframework.stereotype.Component;

@Component
public class NotificationMessageFormatter {
    public NotificationMessage allocateSuccess() {
        return NotificationMessage.ALLOCATE_SUCCESS;
    }
    public NotificationMessage allocateFail() {
        return NotificationMessage.ALLOCATE_FAIL;
    }
}
