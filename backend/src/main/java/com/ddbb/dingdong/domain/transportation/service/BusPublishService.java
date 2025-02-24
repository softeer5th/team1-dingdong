package com.ddbb.dingdong.domain.transportation.service;

import com.ddbb.dingdong.infrastructure.bus.simulator.BusSimulatorFactory;
import com.ddbb.dingdong.infrastructure.bus.subscription.BusSubscriptionManager;
import com.ddbb.dingdong.infrastructure.bus.subscription.publisher.PeriodicBusPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.util.concurrent.SubmissionPublisher;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * 실제 버스 GPS 좌표를 받아오는 구현체도 이 팩터리 객체를 통해서 생성하여 생성 로직을 추상화
 * **/
@Service
@RequiredArgsConstructor
public class BusPublishService {
    private final BusSimulatorFactory busSimulatorFactory;
    private final BusSubscriptionManager manager;

    public void publishSimulator(
            Long busScheduleId,
            Long interval,
            Long initialDelay,
            TimeUnit timeUnit
    ) {
        Supplier<ByteBuffer> supplier =  busSimulatorFactory.create(busScheduleId);
        SubmissionPublisher<ByteBuffer> publisher = new PeriodicBusPublisher<>(manager, busScheduleId, supplier, interval, initialDelay, timeUnit);
        manager.addPublishers(busScheduleId, publisher);
    }
}
