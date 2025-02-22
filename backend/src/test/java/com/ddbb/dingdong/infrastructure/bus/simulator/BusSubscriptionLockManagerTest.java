package com.ddbb.dingdong.infrastructure.bus.simulator;

import com.ddbb.dingdong.infrastructure.lock.ChannelLock;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class BusSubscriptionLockManagerTest {
    private static final Logger log = LoggerFactory.getLogger(BusSubscriptionLockManagerTest.class);
    private BusSubscriptionLockManager busSubscriptionLockManager;

    public BusSubscriptionLockManagerTest() {
        this.busSubscriptionLockManager = new BusSubscriptionLockManager();
    }

    @Test
    void testStopLocking() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        ExecutorService executorService = Executors.newFixedThreadPool(50);
        busSubscriptionLockManager.addLock(1L);

        CountDownLatch stopLatch = new CountDownLatch(6);
        for (int i = 0; i < 5; i++) {
            final int index = i;
            executorService.submit(() -> {
                try {
                    latch.await();
                    Thread.sleep(index * 10);
                    ChannelLock lock = busSubscriptionLockManager.getLock(1L)
                            .orElseThrow(() -> new IllegalStateException("No Lock "));
                    try {
                        log.info("{} lock waited {}", index, System.currentTimeMillis());
                        if (!lock.entryLock()) {
                            log.info("{} Lock stopped", index);
                        } else {
                            log.info("{} Lock acquired", index);
                            log.info("{} Unlocked with acquired", index);
                            lock.unlock();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        log.info("{} Unlocked", index);
                        lock.unlock();
                    }
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (IllegalStateException e) {
                    log.info("{} {} ", index, e.getMessage());
                } finally {
                    stopLatch.countDown();
                }
            });
        }
        executorService.submit(() -> {
            try {
                latch.await();
                Thread.sleep(3L);
                busSubscriptionLockManager.removeLock(1L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                stopLatch.countDown();
            }
        });
        latch.countDown();
        stopLatch.await();
    }

    @Test
    void testLongJobLocking() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        ExecutorService executorService = Executors.newFixedThreadPool(1001);
        busSubscriptionLockManager.addLock(1L);

        CountDownLatch stopLatch = new CountDownLatch(1001);
        for (int i = 0; i < 1000; i++) {
            final int index = i;
            executorService.submit(() -> {
                try {
                    latch.await();
                    Thread.sleep(index * 5);
                    ChannelLock lock = busSubscriptionLockManager.getLock(1L)
                            .orElseThrow(() -> new IllegalStateException("No Lock "));
                    try {
                        log.info("{} lock waited", index);
                        if (!lock.entryLock()) {
                            log.info("{} Lock stopped", index);
                        } else {
                            log.info("{} Lock acquired", index);
                            Thread.sleep(50L);
                            log.info("{} Unlocked with acquired", index);
                            lock.unlock();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        lock.unlock();
                    }
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (IllegalStateException e) {
                } finally {
                    stopLatch.countDown();
                }
            });
        }
        executorService.submit(() -> {
            try {
                latch.await();
                System.out.println("latch wait finished");
                Thread.sleep(500L);
                busSubscriptionLockManager.removeLock(1L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                stopLatch.countDown();
            }
        });
        latch.countDown();
        stopLatch.await();
    }

    @Test
    void testLongJobLockingInBusy() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        ExecutorService busyService = Executors.newFixedThreadPool(1501);
        for (int i = 0; i < 1500; i++) {
            busyService.submit(() -> {
                while (true) {
                    Thread.sleep(15L);
                }
            });
        }
        ExecutorService executorService = Executors.newFixedThreadPool(1001);
        busSubscriptionLockManager.addLock(1L);

        CountDownLatch stopLatch = new CountDownLatch(1001);
        for (int i = 0; i < 1000; i++) {
            final int index = i;
            executorService.submit(() -> {
                try {
                    latch.await();
                    Thread.sleep(index * 10);
                    ChannelLock lock = busSubscriptionLockManager.getLock(1L)
                            .orElseThrow(() -> new IllegalStateException("No Lock "));
                    try {
                        log.info("{} lock waited {}", index, System.currentTimeMillis());
                        if (!lock.entryLock()) {
                            log.info("{} Lock stopped", index);
                        } else {
                            log.info("{} Lock acquired", index);
                            Thread.sleep(50L);
                            log.info("{} Unlocked with acquired", index);
                            lock.unlock();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        lock.unlock();
                    }
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (IllegalStateException e) {
                } finally {
                    stopLatch.countDown();
                }
            });
        }
        executorService.submit(() -> {
            try {
                latch.await();
                System.out.println("latch wait finished");
                Thread.sleep(500L);
                busSubscriptionLockManager.removeLock(1L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                stopLatch.countDown();
            }
        });
        latch.countDown();
        stopLatch.await();
    }
}

