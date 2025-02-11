package com.ddbb.dingdong.domain.reservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long busScheduleId;

    @Column(nullable = false)
    private Long busStopId;

    @OneToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
}
