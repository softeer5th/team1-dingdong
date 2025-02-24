package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.infrastructure.notification.NotificationSender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestFCMNotificationUseCase implements UseCase<TestFCMNotificationUseCase.Param, Void> {
    private final NotificationSender notificationSender;

    @Override
    public Void execute(Param param) {
        notificationSender.send("test", "fcm token test 입니다.", List.of(param.userId));
        return null;
    }

    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
    }
}
