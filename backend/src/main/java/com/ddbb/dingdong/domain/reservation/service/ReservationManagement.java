package com.ddbb.dingdong.domain.reservation.service;

import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import com.ddbb.dingdong.domain.reservation.entity.Ticket;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationType;
import com.ddbb.dingdong.domain.reservation.repository.ReservationQueryRepository;
import com.ddbb.dingdong.domain.reservation.repository.ReservationRepository;
import com.ddbb.dingdong.domain.reservation.service.error.DuplicatedReservationErrorInfo;
import com.ddbb.dingdong.domain.reservation.service.error.ReservationErrors;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationFailedEvent;
import com.ddbb.dingdong.domain.reservation.service.event.AllocationSuccessEvent;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ReservationManagement {
    private final ReservationRepository reservationRepository;
    private final ReservationQueryRepository reservationQueryRepository;
    private final ApplicationEventPublisher eventPublisher;

    public Reservation reserve(Reservation reservation) {
        if(reservation.getType().equals(ReservationType.GENERAL)) {
            return reserveGeneral(reservation);
        } else {
            return reserveTogether(reservation);
        }
    }

    public void cancel(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(ReservationErrors.NOT_FOUND::toException);

        if(!reservation.getUserId().equals(userId)) {
            throw ReservationErrors.INVALID_ACCESS.toException();
        }

        reservation.cancel();
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

        eventPublisher.publishEvent(new AllocationSuccessEvent(reservation.getId(), reservation.getUserId()));
    }

    public void fail(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(ReservationErrors.NOT_FOUND::toException);
        reservation.fail();
        reservationRepository.save(reservation);

        eventPublisher.publishEvent(new AllocationFailedEvent(reservation.getId(), reservation.getUserId()));
    }

    public void validateGeneralReservationDate(LocalDateTime reservationDate , Direction direction) {
        LocalDate allowedDate = LocalDate.now().plusDays(2);
        LocalDate maxAllowedDate = allowedDate.plusMonths(2);

        if(reservationDate.getMinute() != 0 && reservationDate.getMinute() != 30) {
            throw ReservationErrors.NOT_SUPPORTED_RESERVATION_TIME.toException();
        }
        if(direction.equals(Direction.TO_SCHOOL)) {
            if (reservationDate.toLocalTime().isBefore(LocalTime.of(8,0)) || reservationDate.toLocalTime().isAfter(LocalTime.of(18,0))) {
                throw ReservationErrors.NOT_SUPPORTED_RESERVATION_TIME.toException();
            }
        } else {
            if (reservationDate.toLocalTime().isBefore(LocalTime.of(11,0)) || reservationDate.toLocalTime().isAfter(LocalTime.of(21,0))) {
                throw ReservationErrors.NOT_SUPPORTED_RESERVATION_TIME.toException();
            }
        }

        LocalDate reservationDay = reservationDate.toLocalDate();
        if (reservationDay.isBefore(allowedDate)) {
            throw ReservationErrors.EXPIRED_RESERVATION_DATE.toException();
        }
        if (reservationDay.isAfter(maxAllowedDate)) {
            throw ReservationErrors.EXCEEDED_RESERVATION_DATE.toException();
        }

    }

    public void checkHasDuplicatedReservation(Long userId, LocalDateTime hopeTime) {
        if (reservationRepository.existsActiveReservation(hopeTime, userId)) {
            throw ReservationErrors.ALREADY_HAS_SAME_RESERVATION.toException();
        }
    }

    public void checkHasDuplicatedReservations(Long userId, List<LocalDateTime> localDateTimes) {
        List<LocalDateTime> duplicated = reservationQueryRepository.findDuplicatedReservationTime(userId, localDateTimes);
        if (!duplicated.isEmpty()) {
            throw new DuplicatedReservationErrorInfo(duplicated).toException();
        }
    }

    public List<LocalDateTime> recommendReservationDates(YearMonth yearMonth, Direction direction, Timetable timetable) {
        return IntStream.rangeClosed(1, yearMonth.lengthOfMonth())
                .mapToObj(yearMonth::atDay)
                .filter(date -> date.getDayOfWeek().getValue() >= DayOfWeek.MONDAY.getValue() &&
                        date.getDayOfWeek().getValue() <= DayOfWeek.FRIDAY.getValue())
                .map(date -> {
                    LocalTime time = null;
                    DayOfWeek dow = date.getDayOfWeek();
                    switch (dow) {
                        case MONDAY:
                            time = direction == Direction.TO_SCHOOL ? timetable.getMonStartTime() : timetable.getMonEndTime();
                            break;
                        case TUESDAY:
                            time = direction == Direction.TO_SCHOOL ? timetable.getTueStartTime() : timetable.getTueEndTime();
                            break;
                        case WEDNESDAY:
                            time = direction == Direction.TO_SCHOOL ? timetable.getWedStartTime() : timetable.getWedEndTime();
                            break;
                        case THURSDAY:
                            time = direction == Direction.TO_SCHOOL ? timetable.getThuStartTime() : timetable.getThuEndTime();
                            break;
                        case FRIDAY:
                            time = direction == Direction.TO_SCHOOL ? timetable.getFriStartTime() : timetable.getFriEndTime();
                            break;
                        default:
                            break;
                    }
                    if (time == null) {
                        return null;
                    }
                    return LocalDateTime.of(date, time);
                }).filter(Objects::nonNull)
                .filter(reservationDate -> {
                    LocalDateTime now = LocalDateTime.now();
                    LocalDateTime deadLine = reservationDate.minusHours(48).minusMinutes(5);
                    LocalDateTime maxDate = deadLine.plusMonths(2);
                    if(now.isAfter(deadLine)){
                        return false;
                    }
                    if(reservationDate.isAfter(maxDate)){
                        return false;
                    }

                    if(direction.equals(Direction.TO_SCHOOL)) {
                        if (reservationDate.toLocalTime().isBefore(LocalTime.of(8,0)) || reservationDate.toLocalTime().isAfter(LocalTime.of(18,0))) {
                            return false;
                        }
                    } else {
                        if (reservationDate.toLocalTime().isBefore(LocalTime.of(11,0)) || reservationDate.toLocalTime().isAfter(LocalTime.of(21,0))) {
                            return false;
                        }
                    }
                    return true;
                })
                .sorted(Comparator.naturalOrder())
                .collect(Collectors.toList());
    }

    private Reservation reserveGeneral(Reservation reservation) {
        validateGeneralReservation(reservation);
        return reservationRepository.save(reservation);
    }

    private Reservation reserveTogether(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    private void validateGeneralReservation(Reservation reservation) {
        if(!ReservationType.GENERAL.equals(reservation.getType())){
            throw ReservationErrors.INVALID_RESERVATION_TYPE.toException();
        }
        LocalDateTime reservationDate = reservation.getDirection().equals(Direction.TO_SCHOOL) ? reservation.getArrivalTime() : reservation.getDepartureTime();
        validateGeneralReservationDate(reservationDate , reservation.getDirection());
    }


}