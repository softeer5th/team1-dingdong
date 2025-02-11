package com.ddbb.dingdong.infrastructure.bus.simulator.subscription;

import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.SubmissionPublisher;
import java.util.concurrent.locks.StampedLock;

@Service
public class BusSubscriptionManager {
    private final Map<Long, StampedLock> lockMap = new ConcurrentHashMap<>();
    private final Map<Long, SubmissionPublisher<Point>> publishers = new HashMap<>();
    private final Map<Long, Set<UserSubscription>> subscribers = new HashMap<>();

    public BusSubscriptionManager() {}

    public void subscribe(long busId, UserSubscription subscription) {
        StampedLock lock = lockMap.computeIfAbsent(busId, id -> new StampedLock());
        long stamp = lock.writeLock();
        Set<UserSubscription> set = subscribers.computeIfAbsent(busId, id -> new TreeSet<>());
        set.add(subscription);

        publishers.computeIfPresent(busId, (key, publisher) -> {
           publisher.subscribe(subscription.getSubscriber());
           return publisher;
        });
        lock.unlockWrite(stamp);
    }

    public void addPublishers(Long busId, SubmissionPublisher<Point> publisher) {
        StampedLock lock = lockMap.computeIfAbsent(busId, id -> new StampedLock());
        long stamp = lock.writeLock();

        if (!publishers.containsKey(busId)) {
            Set<UserSubscription> subscriberSet = subscribers.computeIfAbsent(busId, (id) -> new TreeSet<>());
            for (UserSubscription subscription : subscriberSet) {
                publisher.subscribe(subscription.getSubscriber());
            }
            publishers.put(busId, publisher);
        }
        lock.unlockWrite(stamp);
    }

    public void unsubscribe(Long busId, Long userId) {
        StampedLock lock = lockMap.computeIfAbsent(busId, id -> new StampedLock());
        long stamp = lock.writeLock();

        subscribers.computeIfPresent(busId, (id, subscriberSet) -> {
            subscriberSet.removeIf(subscription -> {
                if (subscription.getUserId().equals(userId)) {
                    subscription.getSubscriber().cancel();
                    return true;
                }
                return false;
            });
            return subscriberSet;
        });
        if (!(publishers.containsKey(busId) || subscribers.containsKey(busId))) {
            lockMap.remove(busId);
        }
        lock.unlockWrite(stamp);
    }

    /**
     * @param busId : 메모리에서 지울 publisher의 버스 아이디
     * 매개변수로 들어온 버스아이디와 관련된 publisher과 관련된 자원(Subscriber 등)의 메모리를 해제합니다.
     * 자동으로 publisher의 close를 호출하므로 동일한 publisher에 대해서 close 메서드를 재호출하지 않아야 합니다.
     * **/
    public void cleanPublisher(Long busId) {
        StampedLock lock = lockMap.computeIfAbsent(busId, id -> new StampedLock());
        long stamp = lock.writeLock();

        SubmissionPublisher<Point> publisher = publishers.remove(busId);
        subscribers.remove(busId);
        lockMap.remove(busId);
        publisher.close();
        lock.unlockWrite(stamp);
    }

    /**
     * @param busId : 참조를 제거할 publisher의 버스 아이디
     * 매개변수로 들어온 버스아이디와 관련된 publisher와 연관된 subscriber들의 참조를 제거합니다.
     * publisher의 close를 호출하지 않으므로 반드시 해당 publisher에 close 메서드를 호출해야 합니다.
     **/
    public void removeRefOnly(Long busId) {
        StampedLock lock = lockMap.computeIfAbsent(busId, id -> new StampedLock());
        long stamp = lock.writeLock();
        publishers.remove(busId);
        subscribers.remove(busId);
        lockMap.remove(busId);
        lock.unlockWrite(stamp);
    }
}
