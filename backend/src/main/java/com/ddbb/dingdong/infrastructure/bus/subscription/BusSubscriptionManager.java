package com.ddbb.dingdong.infrastructure.bus.subscription;

import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import com.ddbb.dingdong.domain.transportation.service.BusScheduleManagement;
import com.ddbb.dingdong.infrastructure.bus.simulator.BusSubscriptionLockManager;
import com.ddbb.dingdong.infrastructure.bus.subscription.subscriber.CancelableSubscriber;
import com.ddbb.dingdong.infrastructure.lock.StoppableSemaphore;
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
        StoppableSemaphore lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.acquire(true)) {
                throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
            }
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
            lock.release();
        }
    }

    public void addPublishers(Long busId, SubmissionPublisher<Point> publisher) {
        StoppableSemaphore lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.acquire(true)) {
                throw new DomainException(BusErrors.BUS_ALREADY_STOPPED);
            }
            if (!publishers.containsKey(busId)) {
                Map<Long, CancelableSubscriber<Point>> subscriberSet = subscribers.computeIfAbsent(busId, (id) -> new TreeMap<>());
                for (CancelableSubscriber<Point> subscriber : subscriberSet.values()) {
                    publisher.subscribe(subscriber);
                }
                publishers.put(busId, publisher);
            }
        }  catch (Exception e) {
            log.debug(e.getMessage());
            throw new DomainException(BusErrors.BUS_START_ERROR);
        } finally {
            lock.release();
        }
    }

    public void unsubscribe(Long busId, Long userId) {
        log.info("unsubscribe: busId={}, userId={}", busId, userId);
        StoppableSemaphore lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            if (!lock.acquire(false)) {
                return;
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
            lock.release();
        }
    }

    /**
     * @param busId : 메모리에서 지울 publisher의 버스 아이디
     * 매개변수로 들어온 버스아이디와 관련된 publisher과 관련된 자원(Subscriber 등)의 메모리를 해제합니다.
     * 자동으로 publisher의 close를 호출하므로 동일한 publisher에 대해서 close 메서드를 재호출하지 않아야 합니다.
     * **/
    public void cleanPublisher(Long busId) {
        StoppableSemaphore lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            busScheduleManagement.updateBusSchedule(busId, OperationStatus.ENDED);
            lockManager.removeLock(busId);
            if (!lock.acquire(false)) {
                return;
            }
            SubmissionPublisher<Point> publisher = publishers.remove(busId);
            subscribers.remove(busId);

            publisher.close();
            log.info("bus {} has been cleaned {} / {}", busId, publishers.size(), subscribers.size());
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new DomainException(BusErrors.STOP_BUS_ERROR);
        } finally {
            lock.release();
        }
    }

    /**
     * @param busId : 참조를 제거할 publisher의 버스 아이디
     * 매개변수로 들어온 버스아이디와 관련된 publisher와 연관된 subscriber들의 참조를 제거합니다.
     * publisher의 close를 호출하지 않으므로 반드시 해당 publisher에 close 메서드를 호출해야 합니다.
     * lock의 생성 및 제거에 대한 책임은 이 Manager에겐 없지만 발행자가 발행 종료 시 스스로 메모리 및 락을 제거하게 하기 위해
     * 예외적으로 lock 제거 로직을 추가함.
     **/
    public void removeRefOnly(Long busId) {
        StoppableSemaphore lock = lockManager.getLock(busId)
                .orElseThrow(() -> new DomainException(BusErrors.BUS_NOT_INITIATED));
        try {
            busScheduleManagement.updateBusSchedule(busId, OperationStatus.ENDED);
            lockManager.removeLock(busId);
            lock.acquire(false);
            publishers.remove(busId);
            subscribers.remove(busId);

            log.info("bus {} has been cleaned {} / {}", busId, publishers.size(), subscribers.size());
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new DomainException(BusErrors.STOP_BUS_ERROR);
        } finally {
            lock.release();
        }
    }
}
