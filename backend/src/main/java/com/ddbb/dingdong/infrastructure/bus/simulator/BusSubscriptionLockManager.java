package com.ddbb.dingdong.infrastructure.bus.simulator;


import com.ddbb.dingdong.domain.transportation.repository.BusScheduleQueryRepository;
import com.ddbb.dingdong.infrastructure.lock.ChannelLock;
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
    private final Map<Long, ChannelLock> locks = new ConcurrentHashMap<>();

    @PostConstruct
    private void init() {
        List<Long> busSchedules = busScheduleQueryRepository.findLiveBusSchedule();
        for (Long busScheduleId : busSchedules) {
            locks.put(busScheduleId, new ChannelLock());
        }
    }

    public Optional<ChannelLock> getLock(long busScheduleId) {
        ChannelLock stampedLock = locks.get(busScheduleId);
        return Optional.ofNullable(stampedLock);
    }

    public void addLock(long busScheduleId) {
        locks.computeIfAbsent(busScheduleId, id -> new ChannelLock());
    }

    public void removeLock(long busScheduleId) {
        ChannelLock lock = locks.get(busScheduleId);
        if (lock != null) {
            lock.stopAndWait();
            locks.remove(busScheduleId);
        }
    }
}
