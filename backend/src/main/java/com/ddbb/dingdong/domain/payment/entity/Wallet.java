package com.ddbb.dingdong.domain.payment.entity;

import com.ddbb.dingdong.domain.payment.entity.vo.DingdongMoneyUsageType;
import com.ddbb.dingdong.domain.payment.service.PaymentErrors;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer balance;

    @Column(nullable = false)
    private LocalDateTime lastUpdatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL)
    private List<DingdongMoneyUsageHistory> usageHistory;

    public void pay(int totalPrice) {
        if(this.balance < totalPrice) {
            throw PaymentErrors.INSUFFICIENT_BALANCE.toException();
        }
        this.balance -= totalPrice;
        lastUpdatedAt = LocalDateTime.now();
        DingdongMoneyUsageHistory history = generateHistory(DingdongMoneyUsageType.PAY, totalPrice, null);
        this.usageHistory.add(history);
    }

    public void refund(int totalPrice, Long reservationId) {
        if(alreadyRefunded(reservationId)) {
            throw PaymentErrors.ALREADY_REFUNDED.toException();
        }
        this.balance += totalPrice;
        lastUpdatedAt = LocalDateTime.now();
        DingdongMoneyUsageHistory history = generateHistory(DingdongMoneyUsageType.REFUND, totalPrice, reservationId);
        this.usageHistory.add(history);
    }

    private boolean alreadyRefunded(Long reservationId) {
        return this.usageHistory.stream().anyMatch(history ->reservationId.equals(history.getRefundedReservationId()));
    }

    private DingdongMoneyUsageHistory generateHistory(DingdongMoneyUsageType type, int amount, Long reservationId) {
        DingdongMoneyUsageHistory history = new DingdongMoneyUsageHistory();
        history.setType(type);
        history.setAmount(amount);
        history.setRemain(this.balance);
        history.setRefundedReservationId(reservationId);
        history.setTimeStamp(this.lastUpdatedAt);
        history.setWallet(this);

        return history;
    }
}
