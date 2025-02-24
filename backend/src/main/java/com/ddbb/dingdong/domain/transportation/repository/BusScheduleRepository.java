package com.ddbb.dingdong.domain.transportation.repository;

import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
    @Modifying
    @Query("UPDATE BusStop bst SET bst.expectedArrivalTime = :newArrivalTime WHERE bst.id = :busStopId")
    int updateBusStopArrivalTime(
            @Param("newArrivalTime") LocalDateTime newArrivalTime,
            @Param("busStopId") Long busStopId
    );

    @Modifying
    @Query("UPDATE BusSchedule busSchedule SET busSchedule.status = :status WHERE busSchedule.id = :busScheduleId")
    int updateBusScheduleStats(
            @Param("busScheduleId") Long busScheduleId,
            @Param("status") OperationStatus status
    );
}
