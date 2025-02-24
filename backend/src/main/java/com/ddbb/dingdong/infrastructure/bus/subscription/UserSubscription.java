package com.ddbb.dingdong.infrastructure.bus.subscription;

import com.ddbb.dingdong.infrastructure.bus.subscription.subscriber.CancelableSubscriber;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.geo.Point;

import java.nio.ByteBuffer;

@Getter
@AllArgsConstructor
public class UserSubscription implements Comparable<UserSubscription> {
    private Long userId;
    private CancelableSubscriber<ByteBuffer> subscriber;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof UserSubscription other) {
            return userId.equals(other.userId);
        }
        return false;
    }

    @Override
    public int compareTo(UserSubscription o) {
        return userId.compareTo(o.userId);
    }
}
