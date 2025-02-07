package com.ddbb.dingdong.domain.transportation.service;

import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.webSocket.repository.SocketRepository;
import com.ddbb.dingdong.domain.transportation.simulator.subscription.BusSubscriptionManager;
import com.ddbb.dingdong.domain.transportation.simulator.subscription.UserSubscription;
import com.ddbb.dingdong.domain.transportation.simulator.subscription.subscriber.CancelableSubscriber;
import com.ddbb.dingdong.domain.transportation.simulator.subscription.subscriber.SocketSubscriber;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

@Service
@RequiredArgsConstructor
public class BusSubscribeService {
    private final SocketRepository socketRepository;
    private final BusSubscriptionManager busSubscriptionManager;

    public void subscribe(Long userId, Long busId) {
        WebSocketSession session = socketRepository.get(userId);
        if (session == null) {
            throw new DomainException(BusErrors.NO_SOCKET_CONNECTION);
        }
        CancelableSubscriber<Point> subscriber = new SocketSubscriber(busId, userId, session, busSubscriptionManager);
        busSubscriptionManager.subscribe(busId, new UserSubscription(userId, subscriber));
    }

    public void unsubscribe(Long userId, Long busId) {
        busSubscriptionManager.unsubscribe(busId, userId);
    }
}
