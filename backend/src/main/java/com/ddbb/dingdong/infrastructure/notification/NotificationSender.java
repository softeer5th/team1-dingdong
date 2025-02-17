package com.ddbb.dingdong.infrastructure.notification;

import java.util.List;

public interface NotificationSender {
    void send(String title, String content, List<Long> userIds);
}
