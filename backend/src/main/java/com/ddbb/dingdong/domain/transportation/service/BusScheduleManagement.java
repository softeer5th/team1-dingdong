package com.ddbb.dingdong.domain.transportation.service;

import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.transportation.entity.Bus;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.entity.Path;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleRepository;
import com.ddbb.dingdong.domain.transportation.service.dto.UserBusStopTime;
import com.ddbb.dingdong.domain.transportation.service.event.BusDepartureEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static com.ddbb.dingdong.domain.transportation.service.BusErrors.BUS_UPDATE_ERROR;

@Service
@RequiredArgsConstructor
public class BusScheduleManagement {
    private final BusScheduleRepository busScheduleRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BusSchedule allocateBusSchedule(Path path, Long schoolId, Direction direction, LocalDateTime dingdongTime, LocalDate startDate, int reservationCount) {
        BusSchedule busSchedule = new BusSchedule();
        busSchedule.setPath(path);
        busSchedule.setSchoolId(schoolId);
        //TODO 버스할당 ->추후 수정
        busSchedule.setBus(new Bus("버스 01"));
        if(direction.equals(Direction.TO_SCHOOL)) {
            busSchedule.setArrivalTime(dingdongTime);
        } else {
            busSchedule.setDepartureTime(dingdongTime);
        }
        int remainingSeats = 15 - reservationCount;
        if(remainingSeats < 0) {
            throw BusErrors.NO_SEATS.toException();
        }

        busSchedule.setRemainingSeats(remainingSeats);
        busSchedule.setStartDate(startDate);
        busSchedule.setStatus(OperationStatus.READY);
        busSchedule.setDirection(direction);
        path.setBusSchedule(busSchedule);
        return busScheduleRepository.save(busSchedule);
    }

    public List<UserBusStopTime> adjustBusStopTimes(LocalDateTime now, List<UserBusStopTime> userBusStopTimes) {
        List<UserBusStopTime> adjustedUserBusStopTimes = new ArrayList<>();
        if (userBusStopTimes == null || userBusStopTimes.isEmpty()) {
            return adjustedUserBusStopTimes;
        }
        UserBusStopTime head = userBusStopTimes.get(0);
        LocalDateTime updateTime = now;
        LocalDateTime prevTime = head.getTime();

        adjustedUserBusStopTimes.add(head.ofTime(updateTime));
        for (int i = 1; i < userBusStopTimes.size(); i++) {
            UserBusStopTime item = userBusStopTimes.get(i);

            long intervalSecond = ChronoUnit.SECONDS.between(prevTime, item.getTime());
            updateTime = updateTime.plusSeconds(intervalSecond);

            adjustedUserBusStopTimes.add(item.ofTime(updateTime));
            prevTime = item.getTime();
        }
        return adjustedUserBusStopTimes;
    }

    // TODO:: bulk update
    public void updateBusStopTimes(List<UserBusStopTime> userBusStopTimes, List<UserBusStopTime> oldUserBusStopTimes) {
        for (int i = 0; i < userBusStopTimes.size(); i++) {
            UserBusStopTime oldUserBusStopTime = oldUserBusStopTimes.get(i);
            UserBusStopTime newUserBusStopTime = userBusStopTimes.get(i);
            if (!oldUserBusStopTime.equals(newUserBusStopTime)) {
                int res = busScheduleRepository.updateBusStopArrivalTime(newUserBusStopTime.getTime(), newUserBusStopTime.getBusStopId());
                if (res == 0) {
                    throw BUS_UPDATE_ERROR.toException();
                }
            }
        }
    }

    public void updateBusSchedule(Long busScheduleId, OperationStatus status) {
        int result = busScheduleRepository.updateBusScheduleStats(busScheduleId, status);
        if (result == 0) {
            throw BUS_UPDATE_ERROR.toException();
        }
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void publishDepartureEvent(List<UserBusStopTime> userBusStopTimes) {
        for (UserBusStopTime userBusStopTime : userBusStopTimes) {
            eventPublisher.publishEvent(new BusDepartureEvent(userBusStopTime.getTime(), userBusStopTime.getUserReservationIds()));
        }
    }
}
