package com.ddbb.dingdong.global.util;

import com.ddbb.dingdong.infrastructure.routing.model.Coordinate;
import com.ddbb.dingdong.infrastructure.routing.model.dto.RequestRouteOptimizationDTO;
import com.ddbb.dingdong.infrastructure.routing.model.dto.ResponseRouteOptimizationDTO;
import com.ddbb.dingdong.infrastructure.routing.util.CoordinateDeserializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.internal.util.io.IOUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class JsonConverterTest {

    private static final Logger log = LoggerFactory.getLogger(JsonConverterTest.class);
    private Gson gson;

    @Test
    @DisplayName("Request : Json에서 DTO로 변경")
    void fromRequestJson() throws FileNotFoundException {
        FileInputStream fis = new FileInputStream("src/test/resources/static/request.json");
        String json = String.join("\n", IOUtil.readLines(fis));

        gson = new GsonBuilder()
                .setPrettyPrinting()
                .create();

        assertDoesNotThrow(() -> gson.fromJson(json, RequestRouteOptimizationDTO.class));
    }

    @Test
    @DisplayName("Response : Json에서 DTO로 변경")
    void fromResponseJson() throws FileNotFoundException {
        FileInputStream fis = new FileInputStream("src/test/resources/static/response.json");
        String json = String.join("\n", IOUtil.readLines(fis));

        gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(new TypeToken<List<Coordinate>>() {}.getType(), new CoordinateDeserializer())
                .create();

        AtomicReference<ResponseRouteOptimizationDTO> dto = new AtomicReference<>();
        assertDoesNotThrow(() -> {
            dto.set(gson.fromJson(json, ResponseRouteOptimizationDTO.class));});
    }

}