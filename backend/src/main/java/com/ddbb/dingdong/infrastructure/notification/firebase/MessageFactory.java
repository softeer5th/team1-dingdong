package com.ddbb.dingdong.infrastructure.notification.firebase;

import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushFcmOptions;
import com.google.firebase.messaging.WebpushNotification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageFactory {
    @Value("${fcm.renotify}")
    private boolean RENOTIFY;
    @Value("${fcm.silent}")
    private boolean SILENT;
    @Value("${fcm.requireInteraction}")
    private boolean REQUIRE_INTERACTION;
    @Value("${fcm.link}")
    private String LINK_URL;
    @Value("${fcm.image}")
    private String IMAGE;
    @Value("${fcm.icon}")
    private String ICON;
    @Value("{fcm.badge}")
    private String BADGE;

    public MulticastMessage createMulticastMessage(String title, String content, List<String> tokens) {

        WebpushNotification webPushNotification = WebpushNotification.builder()
                .setBody(content)
                .setTitle(title)
                .setLanguage("ko")
                .setTimestampMillis(System.currentTimeMillis())
                .setRequireInteraction(REQUIRE_INTERACTION)
                .setRenotify(RENOTIFY)
                .setSilent(SILENT)
                .setImage(IMAGE)
                .setIcon(ICON)
                .setBadge(BADGE)
                .build();
        return MulticastMessage.builder()
                .addAllTokens(tokens)
                .setWebpushConfig(
                        WebpushConfig.builder()
                                .setNotification(webPushNotification)
                                .setFcmOptions(WebpushFcmOptions.withLink(LINK_URL))
                                .putData("url", LINK_URL)
                                .build()
                )
                .build();
    }
}
