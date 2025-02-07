package com.ddbb.dingdong.domain.transportation.simulator.subscription.publisher;

import com.ddbb.dingdong.domain.transportation.simulator.subscription.BusSubscriptionManager;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.*;
import java.util.function.Supplier;

@Slf4j
public class PeriodicBusPublisher<T> extends SubmissionPublisher<T> {
    private final BusSubscriptionManager manager;
    private final long busId;
    private final ScheduledExecutorService scheduler;
    private final ScheduledFuture<?> periodicTask;

    PeriodicBusPublisher(
            BusSubscriptionManager manager, long busId,
            Supplier<T> supplier, long period, long initialDelay, TimeUnit unit
    ) {
        super();
        this.manager = manager;
        this.busId = busId;
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        this.periodicTask = scheduler.scheduleAtFixedRate(() -> {
            T item = supplier.get();
            if (item == null) {
                this.cleanRef();
                return;
            }
            submit(item);
        }, initialDelay, period, unit);
    }

    public void cleanRef() {
        manager.removeRefOnly(busId);
        this.close();
    }

    public void close() {
        periodicTask.cancel(false);
        scheduler.shutdown();
        super.close();
        log.info("Bus {} publisher is closed", busId);
    }
}
