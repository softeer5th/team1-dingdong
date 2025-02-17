package com.ddbb.dingdong.domain.transportation.repository;

import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import com.ddbb.dingdong.domain.transportation.repository.projection.BusReservedSeatProjection;
import com.ddbb.dingdong.domain.transportation.repository.projection.BusStopLocationProjection;
import com.ddbb.dingdong.domain.transportation.repository.projection.ScheduleTimeProjection;
import jakarta.persistence.LockModeType;
import com.ddbb.dingdong.domain.transportation.repository.projection.UserBusStopProjection;
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

    @Query("SELECT busStop.id as busStopId, res.userId as userId, res.id as reservationId, " +
            "busStop.expectedArrivalTime as busStopArrivalTime " +
            "FROM BusStop busStop " +
            "JOIN Ticket ticket ON ticket.busStopId = busStop.id " +
            "JOIN Reservation res ON res.id = ticket.reservation.id " +
            "JOIN BusSchedule bs ON bs.id = ticket.busScheduleId " +
            "WHERE bs.id = :busScheduleId " +
            "ORDER BY busStop.sequence")
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
}
