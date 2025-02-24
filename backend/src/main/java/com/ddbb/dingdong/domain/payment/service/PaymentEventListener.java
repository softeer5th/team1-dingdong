package com.ddbb.dingdong.domain.payment.service;

import com.ddbb.dingdong.domain.reservation.service.event.AllocationFailedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PaymentEventListener {
    private final PaymentManagement paymentManagement;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void refundEventListener(AllocationFailedEvent event) {
        Long userId = event.getUserId();
        Long reservationId = event.getReservationId();
        paymentManagement.refund(userId, reservationId);
    }
}
