package com.ddbb.dingdong.domain.clustering;

import com.ddbb.dingdong.infrastructure.routing.api.TmapApiKeyManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class ApiClientTest {

    private TmapApiKeyManager tmapApiKeyManager;
    private HttpClient httpClient;
    private static Logger log = LoggerFactory.getLogger(ApiClientTest.class);

    @BeforeEach
    public void setUp() {
        httpClient = HttpClient.newHttpClient();
        tmapApiKeyManager = new TmapApiKeyManager(List.of("a", "b", "c"));
    }

    @Test
    @DisplayName("여러 API Key 사용 테스트")
    void test() {
        String apiKey = tmapApiKeyManager.getCurrentApiKey();

        // 요청은 최대 3번 실행
        for (int i = 0; i < 10; i++) {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://fakeurl.com"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("appKey", apiKey)
                    .GET()
                    .build();

            try {
                HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    log.info("Success");
                } else {
                    log.error("Error Status Code: {}, Error Message: {}", response.statusCode(), response.body());
                    tmapApiKeyManager.switchToNextApiKey();
                    apiKey = tmapApiKeyManager.getCurrentApiKey();
                }
            } catch (IOException | InterruptedException e) {
                log.error(e.getMessage());
                tmapApiKeyManager.switchToNextApiKey();
                apiKey = tmapApiKeyManager.getCurrentApiKey();
            }
        }
    }
}
