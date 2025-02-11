package com.ddbb.dingdong.application.usecase.routing;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.service.ClusteringService;
import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import com.ddbb.dingdong.domain.reservation.entity.Ticket;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.entity.BusStop;
import com.ddbb.dingdong.domain.transportation.entity.Path;
import com.ddbb.dingdong.domain.transportation.service.BusScheduleManagement;
import com.ddbb.dingdong.domain.user.entity.School;
import com.ddbb.dingdong.domain.user.service.UserManagement;
import com.ddbb.dingdong.infrastructure.routing.BusRouteCreationService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CreateRouteUseCase implements UseCase<CreateRouteUseCase.Param, Void> {
    private final ReservationManagement reservationManagement;
    private final ClusteringService clusteringService;
    private final BusScheduleManagement busScheduleManagement;
    private final BusRouteCreationService busRouteCreationService;
    private final UserManagement userManagement;

    @Transactional
    @Override
    public Void execute(Param param) {
        String clusterLabel = param.getClusterLabel();
        generateBusSchedule(clusterLabel);

        return null;
    }

    //tmap api로 버스 스케쥴 만들기.
    private void generateBusSchedule(String clusterLabel) {
        List<Reservation> reservations = reservationManagement.findByClusterLabel(clusterLabel);
        Reservation anyReservation = reservations.get(0);
        Direction direction = anyReservation.getDirection();
        School school = userManagement.load(anyReservation.getUserId()).getSchool();
        List<Location> locations = clusteringService.findByClusterLabel(clusterLabel);
        Path path = busRouteCreationService.routeOptimization(locations, school, direction);
        LocalDateTime dingdongTime = direction.equals(Direction.TO_HOME) ? anyReservation.getDepartureTime() : anyReservation.getArrivalTime();
        BusSchedule busSchedule = busScheduleManagement.allocateBusSchedule(
                path,
                school.getId(),
                direction,
                dingdongTime,
                anyReservation.getStartDate()
        );

        Map<Long, Long> allocatedReservation = new HashMap<>();
        Set<Long> locatedId = new HashSet<>();
        for(Location location : locations) {
            allocatedReservation.put(location.getReservationId(), location.getId());
            locatedId.add(location.getId());
        }

        Map<Long, BusStop> allocatedBusStop = new HashMap<>();
        List<BusStop> busStops = path.getBusStop();
        BusStop lastBusStop = null;
        for(BusStop busStop : busStops) {
            Long locationId = busStop.getLocationId();
            if(locationId == null) {
                lastBusStop = busStop;
            } else {
                locatedId.remove(locationId);
            }
            allocatedBusStop.put(busStop.getLocationId(), busStop);
        }

        if(lastBusStop != null && !locatedId.isEmpty()) {
            Long lastLocationId = locatedId.stream().findFirst().get();
            allocatedBusStop.put(lastLocationId, lastBusStop);
        }

        for(Reservation reservation : reservations) {
            Long allocationId = allocatedReservation.get(reservation.getId());
            BusStop busStop = allocatedBusStop.get(allocationId);
            busStop.setLocationId(allocationId);
            Ticket ticket = new Ticket();
            ticket.setBusScheduleId(busSchedule.getId());
            ticket.setReservation(reservation);
            ticket.setBusStopId(busStop.getId());
            reservationManagement.allocate(reservation,ticket);
        }
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private String clusterLabel;
    }
}
