package com.ddbb.dingdong.domain.reservation.entity;

import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationType;
import com.ddbb.dingdong.domain.reservation.service.ReservationErrors;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = null;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Direction direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationType type;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(nullable = false)
    private Long userId;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
    private Ticket ticket;

    public void cancel() {
        if(!ReservationStatus.PENDING.equals(this.status)) {
            throw ReservationErrors.CANCELLATION_NOT_ALLOWED.toException();
        }

        this.status = ReservationStatus.CANCELED;
    }

    public void fail() {
        if(!ReservationStatus.PENDING.equals(this.status)) {
            throw ReservationErrors.ALLOCATION_NOT_ALLOWED.toException();
        }

        this.status = ReservationStatus.FAIL_ALLOCATED;
    }

    public void allocate(Ticket ticket) {
        if(ticket == null || ticket.getBusScheduleId() == null || ticket.getBusStopId() == null) {
            throw ReservationErrors.INVALID_BUS_TICKET.toException();
        }
        if(!ReservationStatus.PENDING.equals(this.status)) {
            throw ReservationErrors.ALLOCATION_NOT_ALLOWED.toException();
        }

        this.ticket = ticket;
        this.status = ReservationStatus.ALLOCATED;
    }
}
