package com.ddbb.dingdong.domain.reservation.service;

import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import com.ddbb.dingdong.domain.reservation.entity.Ticket;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationType;
import com.ddbb.dingdong.domain.reservation.repository.ReservationRepository;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationFailedEvent;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationSuccessEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationManagement {
    private final ReservationRepository reservationRepository;
    private final ApplicationEventPublisher eventPublisher;

    public Reservation reserve(Reservation reservation) {
        if(ReservationType.GENERAL.equals(reservation.getType())){
            validateDateOfGeneralReservation(reservation);
        }
        return reservationRepository.save(reservation);
    }

    public List<Reservation> findByClusterLabel(String clusterLabel) {
        List<Reservation> cluster = reservationRepository.findAllByClusterLabel(clusterLabel);
        if(cluster.isEmpty()) {
            throw ReservationErrors.NOT_FOUND.toException();
        }

        return cluster;
    }

    public void allocate(Reservation reservation, Ticket ticket) {
        reservation.allocate(ticket);
        reservationRepository.save(reservation);

        eventPublisher.publishEvent(new AllocationSuccessEvent(reservation.getId()));
    }


    public void fail(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(ReservationErrors.NOT_FOUND::toException);
        reservation.fail();
        reservationRepository.save(reservation);

        eventPublisher.publishEvent(new AllocationFailedEvent(
                reservation.getUserId(),
                new AllocationFailedEvent.ReservationInfo(
                        reservationId,
                        reservation.getDirection(),
                        reservation.getDirection().equals(Direction.TO_HOME) ? reservation.getDepartureTime() : reservation.getArrivalTime(),
                        reservation.getStartDate()
                ),
                LocalDateTime.now()
        ));
    }

    private void validateDateOfGeneralReservation(Reservation reservation) {
        if(!ReservationType.GENERAL.equals(reservation.getType())){
            throw ReservationErrors.INVALID_RESERVATION_TYPE.toException();
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reservationDate = reservation.getDirection().equals(Direction.TO_SCHOOL) ? reservation.getArrivalTime() : reservation.getDepartureTime();
        LocalDateTime deadLine = reservationDate.minusHours(48).minusMinutes(5);
        LocalDateTime maxDate = reservationDate.plusMonths(2);

        if(now.isAfter(deadLine)){
            throw ReservationErrors.EXPIRED_RESERVATION_DATE.toException();
        }
        if(now.isAfter(maxDate)){
            throw ReservationErrors.EXCEEDED_RESERVATION_DATE.toException();
        }
        if(reservationDate.getMinute() != 0 && reservationDate.getMinute() != 30) {
            throw ReservationErrors.NOT_SUPPORTED_RESERVATION_TIME.toException();
        }
        if(reservation.getDirection().equals(Direction.TO_SCHOOL)) {
            if (reservationDate.toLocalTime().isBefore(LocalTime.of(8,0)) || reservationDate.toLocalTime().isAfter(LocalTime.of(18,0))) {
                throw ReservationErrors.NOT_SUPPORTED_RESERVATION_TIME.toException();
            }
        } else {
            if (reservationDate.toLocalTime().isBefore(LocalTime.of(11,0)) || reservationDate.toLocalTime().isAfter(LocalTime.of(21,0))) {
                throw ReservationErrors.NOT_SUPPORTED_RESERVATION_TIME.toException();
            }
        }
    }
}