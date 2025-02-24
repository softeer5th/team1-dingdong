package com.ddbb.dingdong.reservation;

import com.ddbb.dingdong.application.usecase.reservation.MakeTogetherReservationUseCase;
import com.ddbb.dingdong.application.usecase.reservation.RequestTogetherReservationUseCase;
import com.ddbb.dingdong.domain.reservation.service.ReservationConcurrencyManager;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleRepository;
import com.ddbb.dingdong.infrastructure.cache.SimpleCache;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ReservationConcurrencyTest {

    private static final Logger log = LoggerFactory.getLogger(ReservationConcurrencyTest.class);
    private RequestTogetherReservationUseCase requestTogetherReservationUseCase;
    private MakeTogetherReservationUseCase makeTogetherReservationUseCase;
    private BusScheduleRepository busScheduleRepository ;
    private SimpleCache simpleCache = new SimpleCache();

    private static final int MAX_USERS = 99;
    private static final int MAX_SUCCESS = 15;
    private final ExecutorService executor = Executors.newFixedThreadPool(MAX_USERS);
    private ReservationConcurrencyManager reservationConcurrencyManager;

    @BeforeEach
    public void init() {
        BusSchedule busSchedule = busScheduleRepository.findById(1L).get();
        reservationConcurrencyManager.initReservationData(busSchedule);
    }

    @Test
    @DisplayName("100명 예매 동시성 실험")
    public void test() throws InterruptedException {
        AtomicInteger success = new AtomicInteger(1);
        AtomicInteger fail = new AtomicInteger(0);
        CountDownLatch countDownLatch = new CountDownLatch(1);

        for (int i = 2; i <= MAX_USERS; i++) {
            int finalI = i;
            executor.submit(() -> {
                try {
                    countDownLatch.await();
                    RequestTogetherReservationUseCase.Result result = requestTogetherReservationUseCase.execute(new RequestTogetherReservationUseCase.Param((long) finalI, 1L, 1L));
                    Thread.sleep(new Random().nextInt(10)*1000);
                    makeTogetherReservationUseCase.execute(new MakeTogetherReservationUseCase.Param(
                            result.getToken(),
                            new MakeTogetherReservationUseCase.Param.ReservationInfo(
                                    (long) finalI, 1L, 1L)
                            )
                    );
                    success.incrementAndGet();
                    makeTogetherReservationUseCase.execute(new MakeTogetherReservationUseCase.Param(
                                    result.getToken(),
                                    new MakeTogetherReservationUseCase.Param.ReservationInfo(
                                            (long) finalI, 1L, 1L)
                            )
                    );
                    success.incrementAndGet();
                } catch (Exception e) {
                    log.error("User ID: {} | {}", finalI, e.getMessage());
                    fail.incrementAndGet();
                    throw new RuntimeException(e);
                }
            });
        }

        countDownLatch.countDown();
        Thread.sleep(15000);

        assertEquals(MAX_SUCCESS, success.get());
        assertEquals(MAX_USERS - 1, fail.get());
    }

    @Test
    @DisplayName("버스 출발 후 예매 막히는 지 확인")
    public void testBusStart() throws InterruptedException {
        AtomicInteger success = new AtomicInteger(1);
        AtomicInteger fail = new AtomicInteger(0);

        for (int i = 2; i <= MAX_USERS; i++) {
            try {
                RequestTogetherReservationUseCase.Result result = requestTogetherReservationUseCase.execute(new RequestTogetherReservationUseCase.Param((long) i, 1L, 1L));
                Thread.sleep(100);
                if (i == 11) {
                    reservationConcurrencyManager.lockBusSchedule(1L);
                    reservationConcurrencyManager.removeSemaphore(1L);
                }
                makeTogetherReservationUseCase.execute(new MakeTogetherReservationUseCase.Param(
                                result.getToken(),
                                new MakeTogetherReservationUseCase.Param.ReservationInfo(
                                        (long) i, 1L, 1L)
                        )
                );
                success.incrementAndGet();
                makeTogetherReservationUseCase.execute(new MakeTogetherReservationUseCase.Param(
                                result.getToken(),
                                new MakeTogetherReservationUseCase.Param.ReservationInfo(
                                        (long) i, 1L, 1L)
                        )
                );
                success.incrementAndGet();
            } catch (Exception e) {
                log.error("User ID: {} | {}", i, e.getMessage());
                fail.incrementAndGet();
            }
        }

        Thread.sleep(3000);

        assertEquals(10, success.get());
        assertEquals(MAX_USERS - 1, fail.get());
    }

    @Test
    @DisplayName("자동 Clean Up 시, 세마포어가 만료되는지 확인")
    void testCleanUp() throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(1);

        for (int i = 2; i <= MAX_USERS; i++) {
            int finalI = i;
            executor.submit(() -> {
                try {
                    countDownLatch.await();
                    RequestTogetherReservationUseCase.Result result = requestTogetherReservationUseCase.execute(new RequestTogetherReservationUseCase.Param((long) finalI, 1L, 1L));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
        }

        countDownLatch.countDown();
        Thread.sleep(15000);

        assertEquals(14, ((Semaphore) simpleCache.get("busSchedule:1")).availablePermits());
    }
}
