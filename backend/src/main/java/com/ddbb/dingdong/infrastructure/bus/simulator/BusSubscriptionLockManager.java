package com.ddbb.dingdong.infrastructure.bus.simulator;


import com.ddbb.dingdong.domain.transportation.repository.BusScheduleQueryRepository;
import com.ddbb.dingdong.infrastructure.lock.StoppableSemaphore;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class BusSubscriptionLockManager {
    private final BusScheduleQueryRepository busScheduleQueryRepository;
    private Map<Long, StoppableSemaphore> locks = new ConcurrentHashMap<>();

    @PostConstruct
    private void init() {
        List<Long> busSchedules = busScheduleQueryRepository.findLiveBusSchedule();
        for (Long busScheduleId : busSchedules) {
            locks.put(busScheduleId, new StoppableSemaphore(1, false));
        }
    }

    public Optional<StoppableSemaphore> getLock(long busScheduleId) {
        StoppableSemaphore semaphore = locks.get(busScheduleId);
        return Optional.ofNullable(semaphore);
    }

    public void addLock(long busScheduleId) {
        locks.computeIfAbsent(busScheduleId, id -> new StoppableSemaphore(1, false));
    }

    public void removeLock(long busScheduleId) {
        StoppableSemaphore lock = locks.get(busScheduleId);
        if (lock != null) {
            lock.stop();
            locks.remove(busScheduleId);
        }
    }
}
