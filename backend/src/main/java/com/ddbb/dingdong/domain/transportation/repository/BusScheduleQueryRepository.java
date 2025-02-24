package com.ddbb.dingdong.domain.transportation.repository;

import com.ddbb.dingdong.domain.transportation.repository.projection.BusScheduleIdAndReservedSeatsProjection;
import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.repository.projection.*;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusScheduleQueryRepository extends JpaRepository<BusSchedule, Long> {
    @Query("SELECT DISTINCT bs.arrivalTime as time FROM BusSchedule bs WHERE bs.schoolId = :schoolId and bs.status = 'READY'")
    List<ScheduleTimeProjection> findAvailableGoSchoolBusTime(@Param("schoolId") Long schoolId);

    @Query("SELECT DISTINCT bs.departureTime as time FROM BusSchedule bs WHERE bs.schoolId = :schoolId and bs.status = 'READY'")
    List<ScheduleTimeProjection> findAvailableGoHomeBusTime(@Param("schoolId") Long schoolId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b.remainingSeats FROM BusSchedule b WHERE b.id = :id")
    Optional<Integer> findBusScheduleByIdForUpdate(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BusSchedule b WHERE b.id = :id")
    Optional<BusSchedule> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT COUNT(t.id) as reservedSeatCount , bs.id as busScheduleId " +
            "FROM Ticket t " +
            "JOIN BusSchedule bs ON t.busScheduleId = bs.id " +
            "JOIN Reservation r ON t.id = r.ticket.id " +
            "WHERE bs.id in :busScheduleIds " +
            "AND r.status != 'CANCELED' " +
            "GROUP BY bs.id")
    List<BusReservedSeatProjection> findReservedSeatCount(@Param("busScheduleIds") List<Long> busScheduleIds);

    @Query("""
    SELECT DISTINCT busStop.id as busStopId, busStop.expectedArrivalTime as busStopArrivalTime, busStop.sequence
    FROM Path p , BusStop busStop
    WHERE p.busSchedule.id = :busScheduleId AND busStop.path.id = p.id
    ORDER BY busStop.sequence
    """)
    List<UserBusStopProjection> findUserBusStops(@Param("busScheduleId") Long busScheduleId);

    @Query("SELECT busStop.longitude as longitude, busStop.latitude as latitude " +
            "FROM Ticket ticket " +
            "JOIN BusSchedule busSchedule ON busSchedule.id = ticket.busScheduleId " +
            "JOIN Reservation reservation ON reservation.id = ticket.reservation.id " +
            "JOIN BusStop busStop ON busStop.id = ticket.busStopId " +
            "WHERE reservation.userId = :userId AND busSchedule.id = :busScheduleId"
    )
    Optional<BusStopLocationProjection> findBusStopLocation(
            @Param("userId") Long userId,
            @Param("busScheduleId") Long busScheduleId
    );

    @Query("""
        SELECT bs.expectedArrivalTime as arrivalTime, reservation.userId as userId
        FROM BusStop bs
        JOIN Ticket ticket ON ticket.busStopId = bs.id
        JOIN Reservation reservation ON reservation.id = ticket.reservation.id
        WHERE bs.id in :busStopIds
    """)
    List<BusStopArrivalTime> findBusStopArrivalTime(@Param("busStopIds") List<Long> busStopIds);

    @Query("SELECT bs.id FROM BusSchedule bs WHERE bs.status = 'RUNNING' OR bs.status = 'READY'")
    List<Long> findLiveBusSchedule();

    @Query("""
        SELECT 
            bs.id AS busScheduleId,
            COUNT(t) AS reservedSeats
        FROM BusSchedule bs
        LEFT JOIN Ticket t ON t.busScheduleId = bs.id
        WHERE bs.status = 'READY'
        GROUP BY bs.id
    """)
    List<BusScheduleIdAndReservedSeatsProjection> queryReadyBusSchedules();
}
