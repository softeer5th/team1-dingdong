package com.ddbb.dingdong.domain.payment.service;

import com.ddbb.dingdong.domain.payment.entity.Wallet;
import com.ddbb.dingdong.domain.payment.repository.WalletRepository;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationFailedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentManagement {
    private static final int PRICE = 1000;
    private final WalletRepository walletRepository;

    @Transactional
    public void pay(Long userId, int quantity) {
        Wallet wallet = walletRepository.findWalletByUserIdForUpdate(userId)
                .orElseThrow(PaymentErrors.WALLET_NOT_FOUND::toException);
        int totalPrice = quantity * PRICE;
        wallet.pay(totalPrice);

        walletRepository.save(wallet);
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @EventListener
    public void refund(AllocationFailedEvent event) {
        Long userId = event.getUserId();
        Long reservationId = event.getReservationInfo().getReservationId();
        Wallet wallet = walletRepository.findWalletByUserIdForUpdate(userId)
                .orElseThrow(PaymentErrors.WALLET_NOT_FOUND::toException);
        wallet.refund(PRICE, reservationId);

        walletRepository.save(wallet);
    }
}
