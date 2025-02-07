package com.ddbb.dingdong.domain.payment;

import com.ddbb.dingdong.domain.payment.vo.DingdongMoneyUsageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DingdongMoneyUsageHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DingdongMoneyUsageType type;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private Integer remain;

    @Column(nullable = false)
    private LocalDateTime timeStamp;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
}
