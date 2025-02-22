package com.ddbb.dingdong.infrastructure.bus.subscription.subscriber;

import com.ddbb.dingdong.infrastructure.bus.subscription.BusSubscriptionManager;
import com.ddbb.dingdong.util.FormatUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Point;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.Objects;
import java.util.concurrent.Flow;

@Slf4j
public class SocketSubscriber extends CancelableSubscriber<Point> {
    private final long busId;
    private final long userId;
    private final WeakReference<WebSocketSession> weakRef;
    private final BusSubscriptionManager busSubscriptionManager;

    public SocketSubscriber(long busId, long userId, WebSocketSession session, BusSubscriptionManager busSubscriptionManager) {
        Objects.requireNonNull(session);
        this.busId = busId;
        this.userId = userId;
        this.weakRef = new WeakReference<>(session);
        this.busSubscriptionManager = busSubscriptionManager;
    }

    @Override
    public void onSubscribe(Flow.Subscription subscription) {
        this.subscription = subscription;
        subscription.request(1L);
    }

    @Override
    public void onNext(Point item) {
        WebSocketSession webSocketSession = weakRef.get();
        if (webSocketSession == null || !webSocketSession.isOpen()) {
            this.busSubscriptionManager.unsubscribe(busId, userId);
            return ;
        }
        String message = FormatUtil.format(busId, item.getY(), item.getX());
        try {
            webSocketSession.sendMessage(new TextMessage(message));
        } catch (IOException e) {
            this.busSubscriptionManager.unsubscribe(busId, userId);
            return;
        }
        this.subscription.request(1L);
    }

    @Override
    public void onError(Throwable throwable) {
        log.error(throwable.getMessage(), throwable);
        this.busSubscriptionManager.unsubscribe(busId, userId);
    }

    @Override
    public void onComplete() {
        log.info("socket subscriber complete onComplete {} {}", busId, userId);
        this.busSubscriptionManager.unsubscribe(busId, userId);
    }
}
