package com.ddbb.dingdong.reservation;

import com.ddbb.dingdong.application.usecase.reservation.MakeTogetherReservationUseCase;
import com.ddbb.dingdong.application.usecase.reservation.RequestTogetherReservationUseCase;
import com.ddbb.dingdong.domain.reservation.service.ReservationConcurrencyManager;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleRepository;
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
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class ReservationConcurrencyTest {

    private static final Logger log = LoggerFactory.getLogger(ReservationConcurrencyTest.class);
    @Autowired
    RequestTogetherReservationUseCase requestTogetherReservationUseCase;

    @Autowired
    MakeTogetherReservationUseCase makeTogetherReservationUseCase;

    @Autowired
    BusScheduleRepository busScheduleRepository;

    private static final int MAX_USERS = 99;
    private static final int MAX_SUCCESS = 15;
    private final ExecutorService executor = Executors.newFixedThreadPool(MAX_USERS);
    @Autowired
    private ReservationConcurrencyManager reservationConcurrencyManager;


    @Test
    @DisplayName("100명 예매 동시성 실험")
    public void test() throws InterruptedException {
        AtomicInteger success = new AtomicInteger(1);
        AtomicInteger fail = new AtomicInteger(0);
        CountDownLatch countDownLatch = new CountDownLatch(1);

        BusSchedule busSchedule = busScheduleRepository.findById(1L).get();
        reservationConcurrencyManager.initReservationData(busSchedule);

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
}
