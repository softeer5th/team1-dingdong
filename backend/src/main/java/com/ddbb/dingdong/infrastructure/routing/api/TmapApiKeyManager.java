package com.ddbb.dingdong.infrastructure.routing.api;

import org.springframework.stereotype.Component;

@Component
public class TmapApiKeyManager extends ApiKeyManager {
    public TmapApiKeyManager(TmapApiProperties tmapApiProperties) {
        super(tmapApiProperties.getApikeys());
    }
}
