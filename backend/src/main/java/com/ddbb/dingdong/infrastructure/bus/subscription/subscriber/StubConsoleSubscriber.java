package com.ddbb.dingdong.infrastructure.bus.subscription.subscriber;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Point;

import java.nio.ByteBuffer;
import java.util.concurrent.Flow;

@Slf4j
public class StubConsoleSubscriber extends CancelableSubscriber<ByteBuffer> {
    @Override
    public void onSubscribe(Flow.Subscription subscription) {
        this.subscription = subscription;
        this.subscription.request(Long.MAX_VALUE);
    }

    @Override
    public void onNext(ByteBuffer item) {
        System.out.println(item);
    }

    @Override
    public void onError(Throwable throwable) {
        log.debug(throwable.getMessage());
        this.subscription.cancel();
    }

    @Override
    public void onComplete() {
        log.info("onComplete");
        this.subscription.cancel();
    }
}
