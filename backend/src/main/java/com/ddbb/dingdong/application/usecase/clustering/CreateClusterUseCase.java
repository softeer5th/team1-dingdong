package com.ddbb.dingdong.application.usecase.clustering;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.repository.LocationRepository;
import com.ddbb.dingdong.domain.clustering.service.ClusteringService;
import com.ddbb.dingdong.domain.clustering.service.error.ClusterErrors;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateClusterUseCase implements UseCase<CreateClusterUseCase.Param, Void> {
    private final ClusteringService clusteringService;
    private final LocationRepository locationRepository;
    private final ReservationManagement reservationManagement;

    @Transactional
    @Override
    public Void execute(Param param) {
        List<Location> allLocations = getAllLocations(param);
        cluster(allLocations, param.direction, param.dingdongTime);
        handleFail(allLocations);
        return null;
    }

    private void cluster(List<Location> allLocations, Direction direction, LocalDateTime dingdongTime) {
        if(allLocations.isEmpty()) throw ClusterErrors.EMPTY_RESERVATIONS.toException();
        try {
            clusteringService.cluster(allLocations, direction, dingdongTime);
        } catch (Exception e) {
            throw ClusterErrors.UNKNOWN.toException();
        }
    }

    private void handleFail(List<Location> clusters) {
        for(Location location : clusters) {
            if(location.getClusterLabel() == null) {
                reservationManagement.fail(location.getReservationId());
            }
        }
    }

    private List<Location> getAllLocations(Param param) {
        int direction = switch (param.getDirection()) {
            case TO_SCHOOL -> 0;
            case TO_HOME -> 1;
        };
        LocalDateTime dingdongTime = param.getDingdongTime();

        return locationRepository.findAllByDirectionAndDingdongTimeWherePending(direction, dingdongTime);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Direction direction;
        private LocalDateTime dingdongTime;
    }
}
