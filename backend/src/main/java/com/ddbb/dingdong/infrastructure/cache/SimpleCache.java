package com.ddbb.dingdong.infrastructure.cache;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

/**
 * 간단한 인메모리 캐시 구현체입니다.
 * 이 캐시는 각 항목에 TTL(Time-To-Live)을 적용하며, 만료된 항목은 lazy expiration 방식과
 * 주기적으로 스캔을 하여 만료된 cache를 제거합니다.
 *
 */
@Slf4j
@Component
public class SimpleCache  {
    private final Map<Object, CacheEntry> map = new HashMap<>();
    public record CacheEntry(Object value, long expiryTimeMillis, Runnable afterExpiryTask) {}
    private int RANDOM_SELECT_SIZE;
    @Value("${cache.cleanupIntervalMinutes:60}")
    private long cleanupIntervalMinutes;

    @PostConstruct
    public void init() {
        System.out.println(cleanupIntervalMinutes);
        Duration cleanupInterval = Duration.ofMinutes(cleanupIntervalMinutes);
        this.RANDOM_SELECT_SIZE = 100;
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(
                this::cleanUp,
                cleanupInterval.toMillis(),
                cleanupInterval.toMillis(),
                TimeUnit.MILLISECONDS
        );
    }
    /**
     * 캐시에 키와 값을 저장합니다.
     * 지정된 TTL을 기준으로 만료 시간을 설정합니다.
     * @param key   캐시 키
     * @param value 캐시 값
     */
    public void put(Object key, Object value, Duration ttl) {
        long expiryTime = System.currentTimeMillis() + ttl.toMillis();
        map.put(key, new CacheEntry(value, expiryTime, null));
    }

    /**
     * 캐시에 키와 값, 만료 시 행동을 저장합니다.
     * 지정된 TTL을 기준으로 만료 시간을 설정합니다.
     * @param key   캐시 키
     * @param value 캐시 값
     * @param afterExpiryTask 만료 후 행동
     */
    public void put(Object key, Object value, Runnable afterExpiryTask, Duration ttl) {
        long expiryTime = System.currentTimeMillis() + ttl.toMillis();
        map.put(key, new CacheEntry(value, expiryTime, afterExpiryTask));
    }

    /**
     * 캐시에 값만 저장합니다.
     * 지정된 TTL을 기준으로 만료 시간을 설정합니다.
     * @param value 캐시 값
     */
    public void put(Object value, Duration ttl) {
        long expiryTime = System.currentTimeMillis() + ttl.toMillis();
        map.put(value, new CacheEntry(value, expiryTime, null));
    }
    /**
     * 캐시에 값만 저장합니다.
     * 지정된 TTL을 기준으로 만료 시간을 설정합니다.
     * @param value 캐시 값
     * @param afterExpiryTask 만료 후 행동
     */
    public void put(Object value, Runnable afterExpiryTask, Duration ttl) {
        long expiryTime = System.currentTimeMillis() + ttl.toMillis();
        map.put(value, new CacheEntry(value, expiryTime, afterExpiryTask));
    }

    /**
     * 캐시에서 키에 해당하는 값을 반환합니다.
     * 만약 항목이 만료되었다면 반환을 하면서 제거합니다 (lazy expiration 전략)
     *
     * @param key 조회할 키
     * @return 만료되지 않은 값 또는 null
     */
    public Object get(Object key) {
        CacheEntry entry = map.get(key);
        if (entry != null && System.currentTimeMillis() > entry.expiryTimeMillis) {
            map.remove(key);
            return null;
        }
        return entry != null ? entry.value : null;
    }

    /**
     * 캐시에 해당 키가 존재하는지 확인합니다.
     * lazy expiration 전략을 사용합니다.
     *
     * @param key 조회할 키
     * @return 키가 존재하면 true, 아니면 false
     */
    public boolean containsKey(Object key) {
        CacheEntry entry = map.get(key);
        if (entry != null && System.currentTimeMillis() > entry.expiryTimeMillis) {
            map.remove(key);
        }
        return entry != null;
    }

    /**
     * 캐시에서 키에 해당하는 값을 삭제합니다.
     *
     * @param key
     * @return 키에 해당하는 값이 있다면 해당 값, 없다면 {@code null}을 반환합니다.
     */
    public Object remove(Object key) {
        CacheEntry entry = map.remove(key);
        if (entry != null) return entry.value;
        return null;
    }

    /**
     * 현재 시간 기준으로 만료된 항목들을 제거합니다.
     * 이 메서드는 주기적으로 스캔하며 만료된 캐시를 제거 할 때 사용됩니다.
     */
    protected void cleanUp() {
        long now = System.currentTimeMillis();

        for (Map.Entry<Object, CacheEntry> entry : getRandomEntries()) {
            log.info(getRandomEntries().size() + " entries have been cleaned up in " + now + "ms");
            if (now >= entry.getValue().expiryTimeMillis) {
                log.info("clean up cache");
                if (entry.getValue().afterExpiryTask != null) entry.getValue().afterExpiryTask.run();
                map.remove(entry.getKey());
            }
        }
    }

    protected List<Map.Entry<Object, CacheEntry>> getRandomEntries() {
        List<Map.Entry<Object, CacheEntry>> randomEntries = new ArrayList<>();
        int size = map.size();
        if (size == 0) {
            return randomEntries;
        }
        Object[] entryArray = map.entrySet().toArray();
        int sampleSize = Math.min(RANDOM_SELECT_SIZE, size);
        Set<Integer> selectedIndexes = new HashSet<>();

        while (selectedIndexes.size() < sampleSize) {
            int randomIndex = ThreadLocalRandom.current().nextInt(entryArray.length);
            if (!selectedIndexes.contains(randomIndex)) {
                selectedIndexes.add(randomIndex);
                @SuppressWarnings("unchecked")
                Map.Entry<Object, CacheEntry> entry = (Map.Entry<Object, CacheEntry>) entryArray[randomIndex];
                randomEntries.add(entry);
            }
        }

        return randomEntries;
    }
}