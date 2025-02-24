package com.ddbb.dingdong.infrastructure.lock;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.Semaphore;

@Slf4j
public class StoppableSemaphore extends Semaphore {
    private volatile boolean isStopped = false;

    public StoppableSemaphore(int initialCapacity, boolean fair) {
        super(initialCapacity, fair);
    }

    /**
     * 채널 정지 시 false 반환
     * 채널 정지 시 세마 포어를 얻었더라도 바로 release 후 false 반환
     * 세마포어를 얻지 못 할 시 false 반환
     * 세마 포어를 얻었을 때 채널 정지 상태가 아니라면 true 반환
     **/
    @Override
    public boolean tryAcquire() {
        if (isStopped) {
            return false;
        }
        boolean isAcquired = super.tryAcquire();
        if (isAcquired && isStopped) {
            super.release();
            return false;
        }
        return isAcquired;
    }

    public boolean acquire(boolean useStop) throws InterruptedException {
        if (useStop && isStopped) {
            return false;
        }
        super.acquire();
        if (useStop && isStopped) {
            super.release();
            return false;
        }
        return true;
    }

    /**
     * 채널 정지 메서드
     * **/
    public void stop() {
        if (isStopped) {
            return ;
        }
        isStopped = true;
    }

    public boolean isStopped() {
        return isStopped;
    }
}
