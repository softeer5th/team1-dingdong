package com.ddbb.dingdong.infrastructure.bus.subscription;

import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import com.ddbb.dingdong.domain.transportation.service.BusScheduleManagement;
import com.ddbb.dingdong.infrastructure.bus.simulator.BusSubscriptionLockManager;
import com.ddbb.dingdong.infrastructure.bus.subscription.subscriber.CancelableSubscriber;
import com.ddbb.dingdong.infrastructure.lock.StoppableLock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.SubmissionPublisher;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusSubscriptionManager {
    private final BusSubscriptionLockManager lockManager;
    private final BusScheduleManagement busScheduleManagement;
    private final Map<Long, SubmissionPublisher<Point>> publishers = new HashMap<>();
    private final Map<Long, Map<Long, CancelableSubscriber<Point>>> subscribers = new HashMap<>();


    public void subscribe(long busId, UserSubscription subscription) {
        StoppableLock lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        if (lock.isStopped()) {
            throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
        }
        try {
            lock.lock();
            Map<Long, CancelableSubscriber<Point>> busChannel = subscribers.computeIfAbsent(busId, id -> new TreeMap<>());
            CancelableSubscriber<Point> oldSub = busChannel.put(subscription.getUserId(), subscription.getSubscriber());
            if (oldSub != null) {
                oldSub.cancel();
            }
            publishers.computeIfPresent(busId, (key, publisher) -> {
                publisher.subscribe(subscription.getSubscriber());
                return publisher;
            });
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new DomainException(BusErrors.BUS_SUBSCRIBE_ERROR);
        } finally {
            lock.unlock();
        }
    }

    public void addPublishers(Long busId, SubmissionPublisher<Point> publisher) {
        StoppableLock lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.lock()) {
                throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
            }
            if (!publishers.containsKey(busId)) {
                Map<Long, CancelableSubscriber<Point>> subscriberSet = subscribers.computeIfAbsent(busId, (id) -> new TreeMap<>());
                for (CancelableSubscriber<Point> subscriber : subscriberSet.values()) {
                    publisher.subscribe(subscriber);
                }
                publishers.put(busId, publisher);
            }
            lock.unlock();
        }  catch (Exception e) {
            log.debug(e.getMessage());
            throw new DomainException(BusErrors.BUS_START_ERROR);
        } finally {
            lock.unlock();
        }
    }

    public void unsubscribe(Long busId, Long userId) {
        StoppableLock lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.lock()) {
                throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
            }
            subscribers.computeIfPresent(busId, (id, busChannel) -> {
                busChannel.computeIfPresent(userId, (key, subscriber) -> {
                    subscriber.cancel();
                    return null;
                });
                return busChannel;
            });
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new DomainException(BusErrors.BUS_UNSUBSCRIBE_ERROR);
        } finally {
            lock.unlock();
        }
    }

    /**
     * @param busId : 메모리에서 지울 publisher의 버스 아이디
     * 매개변수로 들어온 버스아이디와 관련된 publisher과 관련된 자원(Subscriber 등)의 메모리를 해제합니다.
     * 자동으로 publisher의 close를 호출하므로 동일한 publisher에 대해서 close 메서드를 재호출하지 않아야 합니다.
     *
     * 반드시 버스 구독 락을 제거하기 전에 호출해야 합니다.
     * **/
    public void cleanPublisher(Long busId) {
        StoppableLock lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.lock()) {
                throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
            }
            SubmissionPublisher<Point> publisher = publishers.remove(busId);
            subscribers.remove(busId);
            busScheduleManagement.updateBusSchedule(busId, OperationStatus.ENDED);
            publisher.close();
            lockManager.removeLock(busId);
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new DomainException(BusErrors.STOP_BUS_ERROR);
        } finally {
            lock.unlock();
        }
    }

    /**
     * @param busId : 참조를 제거할 publisher의 버스 아이디
     * 매개변수로 들어온 버스아이디와 관련된 publisher와 연관된 subscriber들의 참조를 제거합니다.
     * publisher의 close를 호출하지 않으므로 반드시 해당 publisher에 close 메서드를 호출해야 합니다.
     **/
    public void removeRefOnly(Long busId) {
        StoppableLock lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.lock()) {
                throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
            }
            publishers.remove(busId);
            subscribers.remove(busId);
            busScheduleManagement.updateBusSchedule(busId, OperationStatus.ENDED);
            lockManager.removeLock(busId);
            lock.unlock();
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new DomainException(BusErrors.STOP_BUS_ERROR);
        } finally {
            lock.unlock();
        }
    }
}
