package com.ddbb.dingdong.infrastructure.bus.simulator.subscription.subscriber;

import java.util.concurrent.Flow;

public abstract class CancelableSubscriber<T> implements Flow.Subscriber<T> {
    protected Flow.Subscription subscription;

    public void cancel() {
        this.subscription.cancel();
    }
}
