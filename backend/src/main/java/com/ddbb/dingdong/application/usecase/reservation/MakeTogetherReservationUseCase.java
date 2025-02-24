package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.payment.service.PaymentManagement;
import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import com.ddbb.dingdong.domain.reservation.entity.Ticket;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationType;
import com.ddbb.dingdong.domain.reservation.repository.BusStopRepository;
import com.ddbb.dingdong.domain.reservation.service.ReservationConcurrencyManager;
import com.ddbb.dingdong.domain.reservation.service.error.ReservationErrors;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.entity.BusStop;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleRepository;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import com.ddbb.dingdong.infrastructure.auth.encrypt.token.TokenManager;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MakeTogetherReservationUseCase implements UseCase<MakeTogetherReservationUseCase.Param, Void> {
    private final ReservationManagement reservationManagement;
    private final ReservationConcurrencyManager reservationConcurrencyManager;
    private final PaymentManagement paymentManagement;
    private final BusStopRepository busStopRepository;
    private final TokenManager tokenManager;
    private final BusScheduleRepository busScheduleRepository;

    @Transactional
    @Override
    public Void execute(Param param) {
        validateToken(param);
        checkHasDuplicatedReservation(param);
        reserve(param);
        pay(param);
        saveToken(param);

        return null;
    }

    private void saveToken(Param param) {
        tokenManager.saveToken(param.token);
    }

    private void checkHasDuplicatedReservation(Param param) {
        Long userId = param.getReservationInfo().userId;
        LocalDateTime hopeTime = extractTimeFromBusSchedule(param);
        if(hopeTime.isBefore(LocalDateTime.now())) {
            throw ReservationErrors.EXPIRED_RESERVATION_DATE.toException();
        }
        reservationManagement.checkHasDuplicatedReservation(userId, hopeTime);
    }

    private LocalDateTime extractTimeFromBusSchedule(MakeTogetherReservationUseCase.Param param) {
        Long busScheduleId = param.reservationInfo.busScheduleId;
        BusSchedule schedule = busScheduleRepository.findById(busScheduleId).orElseThrow(ReservationErrors.BUS_SCHEDULE_NOT_FOUND::toException);

        return schedule.getDirection().equals(Direction.TO_SCHOOL)
                ? schedule.getArrivalTime()
                : schedule.getDepartureTime();
    }

    private void validateToken(Param param) {
        tokenManager.validateToken(param.token, param.reservationInfo);
    }

    private void pay(Param param) {
        paymentManagement.pay(param.getReservationInfo().userId, 1);
    }

    private void reserve(Param param) {
        Long userId = param.reservationInfo.userId;
        Long busStopId = param.reservationInfo.getBusStopId();
        Long busScheduleId = param.reservationInfo.getBusScheduleId();

        reservationConcurrencyManager.lockBusSchedule(busScheduleId);
        try {
            Long cacheBusScheduleId = reservationConcurrencyManager.getUserInCache(userId);
            if (cacheBusScheduleId == null) {
                reservationConcurrencyManager.releaseSemaphore(busScheduleId);
                throw ReservationErrors.EXCEEDED_RESERVATION_DEADLINE.toException();
            } else if (!cacheBusScheduleId.equals(busScheduleId)) {
                throw ReservationErrors.INVALID_ACCESS.toException();
            }

            BusSchedule busSchedule = busScheduleRepository.findById(busScheduleId)
                    .orElseThrow(ReservationErrors.BUS_SCHEDULE_NOT_FOUND::toException);

            if (!busSchedule.getStatus().equals(OperationStatus.READY)) {
                throw ReservationErrors.EXCEEDED_RESERVATION_DATE.toException();
            }

            BusStop busStop = busStopRepository.findById(busStopId)
                    .orElseThrow(ReservationErrors.BUS_STOP_NOT_FOUND::toException);

            if (busStop.getLocationId() == null) {
                throw ReservationErrors.INVALID_BUS_STOP.toException();
            }

            Long queryBusScheduleId = busStop.getPath().getBusSchedule().getId();

            if (!busScheduleId.equals(queryBusScheduleId)) {
                throw ReservationErrors.INVALID_BUS_SCHEDULE.toException();
            }


            Reservation reservation = makeReservation(busSchedule, userId);
            Ticket ticket = new Ticket(null, busScheduleId, busStopId, reservation);

            reservation.issueTicket(ticket);
            if (busScheduleRepository.issueTicket(busScheduleId) == 0) {
                throw BusErrors.NO_SEATS.toException();
            }

            reservationManagement.reserve(reservation);
        } finally {
            reservationConcurrencyManager.removeUserInCache(userId);
            reservationConcurrencyManager.unlockBusSchedule(busScheduleId);
        }
    }

    private Reservation makeReservation(BusSchedule busSchedule, Long userId) {
        Reservation.ReservationBuilder reservationBuilder = Reservation.builder()
                .userId(userId)
                .type(ReservationType.TOGETHER)
                .direction(busSchedule.getDirection())
                .status(ReservationStatus.ALLOCATED)
                .startDate(busSchedule.getStartDate());
        if(busSchedule.getDirection().equals(Direction.TO_SCHOOL)) {
            reservationBuilder.arrivalTime(busSchedule.getArrivalTime());
        } else {
            reservationBuilder.departureTime(busSchedule.getDepartureTime());
        }

        return reservationBuilder.build();
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private String token;
        private MakeTogetherReservationUseCase.Param.ReservationInfo reservationInfo;

        @Getter
        @AllArgsConstructor
        public static class ReservationInfo {
            private Long userId;
            private Long busStopId;
            private Long busScheduleId;
        }
    }
}
