package com.ddbb.dingdong.infrastructure.bus.simulator.subscription.source;

import org.springframework.data.geo.Point;

import java.util.List;
import java.util.function.Supplier;

public class BusSimulator implements Supplier<Point> {
    private final List<Point> simulatedPoints;
    private int currentPosition = 0;

    public BusSimulator(List<Point> simulatedPoints) {
        this.simulatedPoints = simulatedPoints;
    }

    @Override
    public Point get() {
        if (currentPosition >= simulatedPoints.size()) {
            return null;
        }
        return simulatedPoints.get(currentPosition++);
    }
}
