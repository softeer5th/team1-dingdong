package com.ddbb.dingdong.domain.reservation.service;

import com.ddbb.dingdong.domain.reservation.service.error.ReservationErrors;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.BusScheduleIdAndReservedSeatsProjection;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import com.ddbb.dingdong.infrastructure.cache.SimpleCache;
import com.ddbb.dingdong.infrastructure.lock.StoppableSemaphore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.Semaphore;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationConcurrencyManager {
    private final SimpleCache cache;
    private final BusScheduleQueryRepository busScheduleQueryRepository;
    private static final int EXPIRATION_TIME_MINUTES = 5;
    private static final int EXPIRATION_TIME_DAYS = 2;
    
    private static final String CACHE_ID_BUS_SCHEDULE = "busSchedule";
    private static final String CACHE_ID_USER = "user";

    @EventListener(ApplicationReadyEvent.class)
    protected void init() {
        List<BusScheduleIdAndReservedSeatsProjection> projections = busScheduleQueryRepository.queryReadyBusSchedules();
        for (BusScheduleIdAndReservedSeatsProjection projection : projections) {
            cache.put(String.format(CACHE_ID_BUS_SCHEDULE + ":%d", projection.getBusScheduleId()), new StoppableSemaphore(15 - projection.getReservedSeats(), true), Duration.ofDays(EXPIRATION_TIME_DAYS));
        }
    }

    public void initReservationData(BusSchedule busSchedule) {
        cache.put(String.format(CACHE_ID_BUS_SCHEDULE + ":%d",busSchedule.getId()), new StoppableSemaphore(busSchedule.getRemainingSeats(), true), Duration.ofDays(EXPIRATION_TIME_DAYS));
    }

    public void addUserToTimeLimitCache(Long userId, Long busScheduleId) {
        cache.put(String.format(CACHE_ID_USER + ":%d", userId), busScheduleId, () -> {
            releaseSemaphore(busScheduleId);
        }, Duration.ofMinutes(EXPIRATION_TIME_MINUTES));
    }

    public boolean acquireSemaphore(Long userId, Long busScheduleId) {
        Long cachedBusScheduleId = getUserInCache(userId);

        if(busScheduleId.equals(cachedBusScheduleId)) {
            return true;
        } else if (cachedBusScheduleId != null) {
            removeUserWithReleaseSemaphore(userId);
        }

        StoppableSemaphore semaphore = (StoppableSemaphore) cache.get(String.format(CACHE_ID_BUS_SCHEDULE + ":%d", busScheduleId));
        try {
            if (semaphore == null) {
                throw ReservationErrors.EXPIRED_RESERVATION_DATE.toException();
            } else if (!semaphore.tryAcquire()) {
                throw new InterruptedException();
            }
            return true;
        } catch (InterruptedException e) {
            throw BusErrors.NO_SEATS.toException();
        }
    }

    public void releaseSemaphore(Long busScheduleId) {
        StoppableSemaphore semaphore = (StoppableSemaphore) cache.get(String.format(CACHE_ID_BUS_SCHEDULE + ":%d", busScheduleId));
        if (semaphore != null) {
            semaphore.release();
        }
    }

    public Long getUserInCache(Long userId) {
        Object value = cache.get(String.format(CACHE_ID_USER + ":%d", userId));
        if (value != null) return (Long) value;
        return null;
    }

    public Long removeUserWithReleaseSemaphore(Long userId) {
        Object value = cache.removeWithTask(String.format(CACHE_ID_USER + ":%d", userId));
        if (value != null) return (Long) value;
        return null;
    }

    public Long removeUser(Long userId) {
        Object value = cache.remove(String.format(CACHE_ID_USER + ":%d", userId));
        if (value != null) return (Long) value;
        return null;
    }

    public void lockBusSchedule(Long busScheduleId) {
        StoppableSemaphore lock = (StoppableSemaphore) cache.get(String.format(CACHE_ID_BUS_SCHEDULE + ":%d", busScheduleId));
        lock.stop();
    }

    public void removeSemaphore(Long busScheduleId) {
        cache.remove(String.format(CACHE_ID_BUS_SCHEDULE + ":%d", busScheduleId));
    }

    public int getRemainingSeats(Long busScheduleId) {
        Semaphore semaphore = (Semaphore) cache.get(String.format(CACHE_ID_BUS_SCHEDULE + ":%d", busScheduleId));
        return semaphore.availablePermits();
    }

}
