package com.ddbb.dingdong.domain.clustering.api;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
public abstract class ApiKeyManager {
    private final List<String> apiKeys;
    private final AtomicInteger index = new AtomicInteger(0);

    protected ApiKeyManager(List<String> apiKeys) {
        this.apiKeys = apiKeys;
    }

    public String getCurrentApiKey() {
        return apiKeys.get(index.get() % apiKeys.size());
    }

    public synchronized void switchToNextApiKey() {
        index.incrementAndGet();
        log.info("API Key 변경: {}", index.get() % apiKeys.size());
    }
}
