package com.ddbb.dingdong.infrastructure.notification.firebase;

import com.ddbb.dingdong.infrastructure.notification.NotificationSender;
import com.ddbb.dingdong.infrastructure.notification.firebase.entity.FCMToken;
import com.ddbb.dingdong.infrastructure.notification.firebase.repository.FCMTokenRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FCMPushNotificationSender implements NotificationSender {
    private final FirebaseApp firebaseApp;
    private final MessageFactory messageFactory;
    private final FCMTokenRepository fcmTokenRepository;

    @Override
    public void send(String title, String content, List<Long> userIds) {
        List<FCMToken> tokenEntities = fcmTokenRepository.findActiveTokens(userIds);
        List<String> tokens = tokenEntities.stream().map(FCMToken::getToken).toList();

        MulticastMessage multicastMessage = messageFactory.createMulticastMessage(title, content, tokens);
        try {
            final int size = tokens.size();
            BatchResponse batchResponse = FirebaseMessaging.getInstance(firebaseApp)
                    .sendEachForMulticast(multicastMessage);
            if (batchResponse.getSuccessCount() == size) {
                return;
            }
            // TODO:: 실패 복구 전략 (지터 + 로그 백 오프)
            for (int i = 0; i < size; i++) {
                if (!batchResponse.getResponses().get(i).isSuccessful()) {
                    tokenEntities.get(i).inactivate();
                }
            }
        } catch (FirebaseMessagingException e) {
            log.debug("Message Send Fail: message={}, code={}", e.getMessage(), e.getMessagingErrorCode());
        }
    }
}
