package com.ddbb.dingdong.infrastructure.lock;

import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.transportation.service.BusErrors;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 채널에 대한 락을 동적으로 생성하고 제거하기 위해 만들어진 락입니다.
 * 입장락에 대한 요청은 채널에 넣으려는 아이템이 없다는 것을 가정하고,
 * 퇴장락에 대한 요청은 채널에 제거하려는 아이템이 하나만 존재한다는 것을 가정합니다.
 * 즉 외부에서 채널에 넣을 아이템의 고유성을 보장해주어야 합니다.
 * 락을 받게 되는 순서는 Fair ReentrantLock 에 의해 제어되며 가장 먼저 요청한 스레드에게 락을 먼저 주게 됩니다.
 * */
@Slf4j
public class ChannelLock {
    private final ReentrantLock lock = new ReentrantLock(true);
    private final Condition terminateCondition = lock.newCondition();
    private final AtomicInteger entryCount = new AtomicInteger(0);
    private volatile boolean isStopped = false;

    /**
     * 어떤 채널(외부 컬렉션)에 아이템을 넣을 때 얻는 락입니다. 채널에서 아이템을 제거할 때 이 락을 사용하면 절대 안됩니다.
     * isStopped가 True가 되면 채널에 들어가려는 요청을 막고 락을 받지 못하게 막습니다..
     * 이 락을 얻게 되면 락 상태를 바꾸며, 채널에 아이템이 존재하면 이 채널락을 제거하지 않고 대기합니다.
     * **/
    public boolean entryLock() {
        if (isStopped) {
            return false;
        }
        lock.lock();
        if (isStopped) {
            lock.unlock();
            return false;
        }
        entryCount.incrementAndGet();
        return true;
    }

    /**
     * 어떤 채널(외부 컬렉션)에 아이템을 제거할 때 얻는 락입니다. 채널에서 아이템을 넣을 때 이 락을 사용하면 절때 안됩니다.
     * isStopped 여부와 상관없이 항상 락을 얻을 수 있습니다.
     * 이 락을 얻게 되면 락 상태를 바꾸며 entryCount를 줄이며 entryCount가 0이면 채널이 제거될 수 있습니다.
     */
    public void exitLock() {
        lock.lock();
        entryCount.decrementAndGet();
        if (entryCount.get() == 0) {
            terminateCondition.signal();
        }
    }

    public void unlock() {
        if (lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }

    /**
     * 채널 정지 상태로 변경 후, 채널의 아이템이 모두 제거 될 때까지 스레드를 정지시킵니다.
     * 이 메서드 호출 후에는 안전하게 동적인 락을 제어하는 컬렉션에게 제거 요청을 보낼 수 있습니다.
     *
     * isStopped를 락 전에 상태를 변경해도 락을 대기하던 스레드에서는 곧바로 락을 놓게 되며,
     * 이 메서드가 호출된 이후에 실행되는 락 요청은 모두 거절된다.
     *
     * if 문 호출 전 락을 잡아 await 메서드 실행까지의 entryCount 상태를 보장하여
     * entry 했지만 if 문에서 검출하지 못하여 이 아이템에 빠져나가기 전에 락이 삭제되거나
     * exit 했지만 if 문에서 잡지 못하여 스레드가 무한대기 하는 상태를 방지함
     * **/
    public void stopAndWait() {
        if (isStopped) {
            return ;
        }
        isStopped = true;
        try {
            lock.lock();
            if (entryCount.get() > 0) {
                log.info("Stopping lock waiting for lock {}", entryCount.get());
                terminateCondition.await();
                log.info("lock again, waiting for lock {}", entryCount.get());
            }
        }
        catch (Exception e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.debug(e.getMessage());
            throw new DomainException(BusErrors.STOP_BUS_ERROR);
        }
        finally {
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    public boolean isStopped() {
        return isStopped;
    }
}
