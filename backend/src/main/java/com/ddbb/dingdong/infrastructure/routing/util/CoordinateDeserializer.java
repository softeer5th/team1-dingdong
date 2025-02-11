package com.ddbb.dingdong.infrastructure.routing.util;

import com.ddbb.dingdong.infrastructure.routing.model.Coordinate;
import com.google.gson.*;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class CoordinateDeserializer implements JsonDeserializer<List<Coordinate>> {

    @Override
    public List<Coordinate> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {

        List<Coordinate> result = new ArrayList<>();

        if (json.isJsonArray()) {
            JsonArray jsonArray = json.getAsJsonArray();
            log.debug("jsonArray: {}", jsonArray);

            if (jsonArray.size() > 0 && jsonArray.get(0).isJsonArray()) {
                for (JsonElement arrayElement : jsonArray) {
                    List<Double> point = new ArrayList<>();
                    for (JsonElement coord : arrayElement.getAsJsonArray()) {
                        point.add(coord.getAsDouble());
                    }
                    result.add(new Coordinate(point));
                }
            } else if (jsonArray.size() == 2 && jsonArray.get(0).isJsonPrimitive()) {
                List<Double> point = new ArrayList<>();
                for (JsonElement coord : jsonArray) {
                    point.add(coord.getAsDouble());
                }
                result.add(new Coordinate(point));
            }
        } else {
            throw new JsonParseException("Invalid coordinates format");
        }

        return result;
    }
}