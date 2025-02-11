package com.ddbb.dingdong.application.usecase.clustering;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.clustering.repository.LocationQueryRepository;
import com.ddbb.dingdong.domain.clustering.repository.projection.PendingLocationsProjection;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetLocationUseCase implements UseCase<GetLocationUseCase.Param, GetLocationUseCase.Result> {
    private final LocationQueryRepository locationQueryRepository;

    @Override
    public Result execute(Param param) {
        int direction = switch(param.getDirection()) {
            case TO_SCHOOL -> 0;
            case TO_HOME -> 1;
        };
        LocalDateTime dingdongTime = param.getDingdongTime();
        List<PendingLocationsProjection> projections = locationQueryRepository.findPendingLocationsByDirectionAndTime(direction, dingdongTime);
        List<Result.Location> locations =  projections.stream()
                .map(projection ->
                        new Result.Location(
                            projection.getClusterLabel(),
                            projection.getLatitude(),
                            projection.getLongitude()
                        )).toList();

        return new Result(locations);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        Direction direction;
        LocalDateTime dingdongTime;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        List<Location> locations;

        @Getter
        @AllArgsConstructor
        public static class Location {
            String clusterLabel;
            Double latitude;
            Double longitude;
        }
    }
}
