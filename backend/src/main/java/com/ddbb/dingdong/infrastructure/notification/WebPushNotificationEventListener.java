package com.ddbb.dingdong.infrastructure.notification;

import com.ddbb.dingdong.domain.reservation.service.event.AllocationFailedEvent;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationSuccessEvent;
import com.ddbb.dingdong.domain.transportation.service.event.BusDepartureEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class WebPushNotificationEventListener {
    private final NotificationSender notificationSender;
    private final NotificationMessageFormatter messageFormatter;

    @Async
    @EventListener
    protected void sendAllocationSuccessNotification(AllocationSuccessEvent event) {
        NotificationMessage successMessage = messageFormatter.allocateSuccess();
        notificationSender.send(successMessage.title(), successMessage.content(), List.of(event.getUserId()));
    }

    @Async
    @EventListener
    protected void sendAllocationFailNotification(AllocationFailedEvent event) {
        NotificationMessage notificationMessage = messageFormatter.allocateFail();
        notificationSender.send(notificationMessage.title(), notificationMessage.content(), List.of(event.getUserId()));
    }

    @Async
    @EventListener
    protected void sendBusStartNotification(BusDepartureEvent event) {
        NotificationMessage message = messageFormatter.busDeparture(event.getArrivalTime(), LocalDateTime.now());
        notificationSender.send(message.title(), message.content(), event.getUserIds());
    }
}
