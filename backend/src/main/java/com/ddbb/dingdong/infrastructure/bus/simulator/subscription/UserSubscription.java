package com.ddbb.dingdong.infrastructure.bus.simulator.subscription;

import com.ddbb.dingdong.infrastructure.bus.simulator.subscription.subscriber.CancelableSubscriber;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.geo.Point;

@Getter
@AllArgsConstructor
public class UserSubscription implements Comparable<UserSubscription> {
    private Long userId;
    private CancelableSubscriber<Point> subscriber;

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
