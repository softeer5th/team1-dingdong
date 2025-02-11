package com.ddbb.dingdong.infrastructure.routing.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Getter
@NoArgsConstructor
@Setter
@Component
@ConfigurationProperties(prefix = "api.tmap")
public class TmapApiProperties {
    private List<String> apikeys;
}
