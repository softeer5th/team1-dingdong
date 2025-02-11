package com.ddbb.dingdong.infrastructure.bus.simulator.subscription.publisher;

import com.ddbb.dingdong.infrastructure.bus.simulator.subscription.BusSubscriptionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.concurrent.SubmissionPublisher;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * 실제 버스 GPS 좌표를 받아오는 구현체도 이 팩터리 객체를 통해서 생성하여 생성 로직을 추상화
 * **/
@Service
@RequiredArgsConstructor
public class BusPublisherFactory {
    private final BusSubscriptionManager manager;

    public SubmissionPublisher<Point> createSimulator(Long busId, Supplier<Point> supplier) {
        return new PeriodicBusPublisher<>(manager, busId, supplier, 1, 0, TimeUnit.SECONDS);
    }
}
