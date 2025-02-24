package com.ddbb.dingdong.domain.reservation.service;

import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.BusScheduleIdAndReservedSeatsProjection;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import com.ddbb.dingdong.infrastructure.cache.SimpleCache;
import com.ddbb.dingdong.infrastructure.lock.ChannelLock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationConcurrencyManager {
    private final SimpleCache cache;
    private final BusScheduleQueryRepository busScheduleQueryRepository;
    public enum Type { SEMAPHORE, LOCK };
    private static final int EXPIRATION_TIME_MINUTES = 5;
    private static final int EXPIRATION_TIME_DAYS = 2;

    @EventListener(ApplicationReadyEvent.class)
    protected void init() {
        List<BusScheduleIdAndReservedSeatsProjection> projections = busScheduleQueryRepository.queryReadyBusSchedules();
        for (BusScheduleIdAndReservedSeatsProjection projection : projections) {
            cache.put(Map.entry(projection.getBusScheduleId(), Type.SEMAPHORE), new Semaphore(15 - projection.getReservedSeats(), true), Duration.ofDays(EXPIRATION_TIME_DAYS));
            cache.put(Map.entry(projection.getBusScheduleId(), Type.LOCK), new ChannelLock(), Duration.ofDays(EXPIRATION_TIME_DAYS));
        }
    }

    public void initReservationData(BusSchedule busSchedule) {
        cache.put(Map.entry(busSchedule.getId(), Type.SEMAPHORE), new Semaphore(busSchedule.getRemainingSeats(), true), Duration.ofDays(EXPIRATION_TIME_DAYS));
        cache.put(Map.entry(busSchedule.getId(), Type.LOCK), new ChannelLock(), Duration.ofDays(EXPIRATION_TIME_DAYS));
    }

    public void addUserToTimeLimitCache(Long userId, Long busScheduleId) {
        cache.put(userId, busScheduleId, () -> {
            releaseSemaphore(busScheduleId);
        }, Duration.ofMinutes(EXPIRATION_TIME_MINUTES));
    }

    public boolean acquireSemaphore(Long userId, Long busScheduleId) {
        Long cachedBusScheduleId = getUserInCache(userId);

        if(busScheduleId.equals(cachedBusScheduleId)) {
            return true;
        } else if (cachedBusScheduleId != null) {
            removeUserInCache(userId);
        }

        Semaphore semaphore = (Semaphore) cache.get(Map.entry(busScheduleId, Type.SEMAPHORE));
        try {
            if (!semaphore.tryAcquire(0, TimeUnit.SECONDS)) {
                throw new InterruptedException();
            }
            return true;
        } catch (InterruptedException e) {
            throw BusErrors.NO_SEATS.toException();
        }
    }

    public void releaseSemaphore(Long busScheduleId) {
        Semaphore semaphore = (Semaphore) cache.get(Map.entry(busScheduleId, Type.SEMAPHORE));
        semaphore.release();
    }

    public Long getUserInCache(Long userId) {
        Object value = cache.get(userId);
        if (value != null) return (Long) value;
        return null;
    }

    public Long removeUserInCache(Long userId) {
        Object value = cache.remove(userId);
        if (value != null) return (Long) value;
        return null;
    }

    public boolean lockBusSchedule(Long busScheduleId) {
        ChannelLock lock = (ChannelLock) cache.get(Map.entry(busScheduleId, Type.LOCK));
        return lock.entryLock();
    }

    public void unlockBusSchedule(Long busScheduleId) {
        ChannelLock lock = (ChannelLock) cache.get(Map.entry(busScheduleId, Type.LOCK));
        lock.unlock();
    }

    public int getRemainingSeats(Long busScheduleId) {
        Semaphore semaphore = (Semaphore) cache.get(Map.entry(busScheduleId, Type.SEMAPHORE));
        return semaphore.availablePermits();
    }
}
