package com.ddbb.dingdong.infrastructure.bus.subscription.source;

import org.springframework.data.geo.Point;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;
import java.util.function.Supplier;

public class BusSimulator implements Supplier<ByteBuffer> {
    private final List<Point> simulatedPoints;
    private int currentPosition = 0;

    public BusSimulator(List<Point> simulatedPoints) {
        this.simulatedPoints = simulatedPoints;
    }

    @Override
    public ByteBuffer get() {
        if (currentPosition >= simulatedPoints.size()) {
            return null;
        }
        Point point = simulatedPoints.get(currentPosition++);
        ByteBuffer buffer = ByteBuffer.allocate(16);
        buffer.order(ByteOrder.BIG_ENDIAN);
        buffer.putDouble(point.getX());
        buffer.putDouble(point.getY());
        return buffer.flip();
    }
}
