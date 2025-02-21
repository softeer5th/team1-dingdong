package com.ddbb.dingdong.domain.notification.service;

import com.ddbb.dingdong.domain.auth.service.event.SignUpSuccessEvent;
import com.ddbb.dingdong.domain.notification.entity.vo.NotificationType;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationFailedEvent;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationSuccessEvent;
import com.ddbb.dingdong.domain.transportation.repository.BusStopQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.UserIdAndReservationIdProjection;
import com.ddbb.dingdong.domain.transportation.service.event.BusDepartureEvent;
import com.ddbb.dingdong.infrastructure.webSocket.SocketMessageSender;
import com.ddbb.dingdong.infrastructure.webSocket.repository.SocketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {
    private final NotificationManagement notificationManagement;
    private final SocketMessageSender socketMessageSender;
    private static final int TICKET_PRICE = 1000;
    private static final int WELCOME_MONEY = 30000;
    private static final String ALARM_SOCKET_MSG = "alarm";
    private final BusStopQueryRepository busStopQueryRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    protected void sendAllocationSuccessNotification(AllocationSuccessEvent event) {
        notificationManagement.sendNotification(NotificationType.ALLOCATION_SUCCESS, event.getUserId(), event.getReservationId(), null);
        socketMessageSender.sendMessage(event.getUserId(), ALARM_SOCKET_MSG);
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    protected void sendAllocationFailNotification(AllocationFailedEvent event) {
        notificationManagement.sendNotification(NotificationType.ALLOCATION_FAILED, event.getUserId(), event.getReservationId(), TICKET_PRICE);
        socketMessageSender.sendMessage(event.getUserId(), ALARM_SOCKET_MSG);
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    protected void sendWelcomeNotification(SignUpSuccessEvent event) {
        notificationManagement.sendNotification(NotificationType.WELCOME, event.getUserId(), null, WELCOME_MONEY);
        socketMessageSender.sendMessage(event.getUserId(), ALARM_SOCKET_MSG);
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    protected void sendBusStartEvent(BusDepartureEvent event) {
        List<UserIdAndReservationIdProjection> projections = busStopQueryRepository.queryUserIdByBusStops(event.getBusStopIds());
        for(UserIdAndReservationIdProjection projection : projections) {
            notificationManagement.sendNotification(NotificationType.BUS_START, projection.getUserId(), projection.getReservationId(), null);
            socketMessageSender.sendMessage(
                    projection.getUserId(), String.format(ALARM_SOCKET_MSG + "_%d", projection.getReservationId()), 3
            );
        }
    }
}
