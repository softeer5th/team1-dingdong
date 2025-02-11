package com.ddbb.dingdong.domain.transportation.service;

import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.transportation.entity.Bus;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.entity.Path;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BusScheduleManagement {
    private final BusScheduleRepository busScheduleRepository;

    public BusSchedule allocateBusSchedule(Path path, Long schoolId, Direction direction, LocalDateTime dingdongTime, LocalDate startDate) {
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
        busSchedule.setStartDate(startDate);
        busSchedule.setStatus(OperationStatus.READY);
        path.setBusSchedule(busSchedule);
        return busScheduleRepository.save(busSchedule);
    }

}
