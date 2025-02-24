package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.usecase.reservation.error.ReservationInvalidParamErrors;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.repository.BusStopRepository;
import com.ddbb.dingdong.domain.reservation.service.ReservationConcurrencyManager;
import com.ddbb.dingdong.domain.reservation.service.error.ReservationErrors;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.entity.BusStop;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleRepository;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import com.ddbb.dingdong.infrastructure.auth.encrypt.token.TokenManager;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RequestTogetherReservationUseCase implements UseCase<RequestTogetherReservationUseCase.Param, RequestTogetherReservationUseCase.Result> {
    private final TokenManager tokenManager;
    private final ReservationConcurrencyManager reservationConcurrencyManager;
    private final ReservationManagement reservationManagement;
    private final BusScheduleRepository busScheduleRepository;
    private final BusStopRepository busStopRepository;

    @Override
    public Result execute(Param param) {
        param.validate();
        LocalDateTime hopeTime = extractTimeFromBusSchedule(param);
        checkHasDuplicatedReservation(param.userId, hopeTime);
        boolean acquired = false;
        try {
            acquired = acquireSemaphore(param.busScheduleId);
            String token = generateToken(param);
            addUserToTimeLimitCache(param.userId, param.busScheduleId);
            return new Result(token);
        } catch (Exception e) {
            if (acquired && !(e.getMessage().equals(BusErrors.NO_SEATS.toException().getMessage()))) {
                releaseSemaphore(param.busScheduleId);
            }
            throw e;
        }
    }

    private boolean acquireSemaphore(Long busScheduleId) {
        return reservationConcurrencyManager.acquireSemaphore(busScheduleId);
    }

    private void releaseSemaphore(Long busScheduleId) {
        reservationConcurrencyManager.releaseSemaphore(busScheduleId);
    }

    private void addUserToTimeLimitCache(Long userId, Long busScheduleId) {
        reservationConcurrencyManager.addUserToTimeLimitCache(userId, busScheduleId);
    }

    private String generateToken(Param param) {
        return tokenManager.generateToken(param);
    }

    private void checkHasDuplicatedReservation(Long userId, LocalDateTime hopeTime) {
        reservationManagement.checkHasDuplicatedReservation(userId, hopeTime);
    }

    private LocalDateTime extractTimeFromBusSchedule(Param param) {
        Long busScheduleId = param.busScheduleId;
        Long busStopId = param.getBusStopId();
        BusSchedule schedule = busScheduleRepository.findById(busScheduleId).orElseThrow(ReservationErrors.BUS_SCHEDULE_NOT_FOUND::toException);
        BusStop busStop = busStopRepository.findById(busStopId).orElseThrow(ReservationErrors.BUS_STOP_NOT_FOUND::toException);
        if(busStop.getLocationId() == null) {
            throw ReservationErrors.INVALID_BUS_STOP.toException();
        }
        LocalDateTime hopeTime = schedule.getDirection().equals(Direction.TO_SCHOOL)
                ? schedule.getArrivalTime()
                : schedule.getDepartureTime();

        if(hopeTime.isBefore(LocalDateTime.now())) {
            throw ReservationErrors.EXPIRED_RESERVATION_DATE.toException();
        }

        return hopeTime;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private Long busStopId;
        private Long busScheduleId;

        @Override
        public boolean validate() {
            if (busStopId == null) {
                throw ReservationInvalidParamErrors.INVALID_BUS_STOP_ID.toException();
            } else if (busScheduleId == null) {
                throw ReservationInvalidParamErrors.INVALID_BUS_SCHEDULE_ID.toException();
            }
            return true;
        }
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private String token;
    }
}
