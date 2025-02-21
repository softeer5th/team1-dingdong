package com.ddbb.dingdong.domain.reservation.repository;

import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import com.ddbb.dingdong.domain.reservation.repository.projection.ReservationIdProjection;
import com.ddbb.dingdong.domain.reservation.repository.projection.UserReservationProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationQueryRepository extends JpaRepository<Reservation, Long> {
    @Query(value = """
    SELECT DISTINCT l.stationName AS userHomeStationName,
           r.id AS reservationId,
           r.startDate AS startDate,
           r.direction AS direction,
           r.arrivalTime AS expectedArrivalTime,
           r.departureTime AS expectedDepartureTime,
           bs_arrival.departureTime AS realDepartureTime,
           bs_arrival.arrivalTime AS realArrivalTime,
           r.status AS reservationStatus,
           bs_arrival.id AS busScheduleId,
           b.id AS busId,
           bs_arrival.status AS busStatus,
           bs.roadNameAddress AS busStopRoadNameAddress,
           bs.expectedArrivalTime AS busStopArrivalTime
    FROM Reservation r
    LEFT JOIN Ticket t ON r.id = t.reservation.id
    LEFT JOIN BusStop bs ON t.busStopId = bs.id
    LEFT JOIN BusSchedule bs_arrival ON bs_arrival.id = t.busScheduleId
    LEFT JOIN Bus b ON bs_arrival.bus.id = b.id
    LEFT JOIN Location l ON l.reservationId = r.id
    WHERE r.userId = :userId
        AND (
            (:category = 0)
            OR
            (:category = 1 AND CAST(r.status AS STRING) = 'ALLOCATED' AND bs_arrival.status != 'ENDED')
            OR
            (:category = 2 AND CAST(r.status AS STRING) = 'PENDING')
            OR
            (:category = 3 AND CAST(r.status AS STRING) = 'FAIL_ALLOCATED')
            OR
            (:category = 4 AND CAST(bs_arrival.status AS STRING) = 'ENDED')
            OR
            (:category = 5 AND CAST(r.status AS STRING) = 'CANCELED')
            OR
            (:category = 6 AND ((CAST(r.status AS STRING) = 'ALLOCATED' AND CAST(bs_arrival.status AS STRING) != 'ENDED')OR CAST(r.status AS STRING) = 'PENDING'))
        )
    ORDER BY
       CASE WHEN :sort = 0 THEN r.startDate END DESC,
       CASE WHEN :sort = 1 THEN r.startDate END ASC
    """,
    countQuery = """
    SELECT COUNT(DISTINCT r.id)
    FROM Reservation r
    LEFT JOIN Ticket t ON r.id = t.reservation.id
    LEFT JOIN Location l ON l.reservationId = r.id
    LEFT JOIN BusSchedule bs_arrival ON bs_arrival.id = t.busScheduleId
    WHERE r.userId = :userId
        AND (
            (:category = 0)
            OR
            (:category = 1 AND CAST(r.status AS STRING) = 'ALLOCATED' AND bs_arrival.status != 'ENDED')
            OR
            (:category = 2 AND CAST(r.status AS STRING) = 'PENDING')
            OR
            (:category = 3 AND CAST(r.status AS STRING) = 'FAIL_ALLOCATED')
            OR
            (:category = 4 AND CAST(r.status AS STRING) = 'ENDED')
            OR
            (:category = 5 AND CAST(r.status AS STRING) = 'CANCELED')
            OR
            (:category = 6 AND (CAST(r.status AS STRING) = 'ALLOCATED' OR CAST(r.status AS STRING) = 'PENDING'))
        )
    """)
    Page<UserReservationProjection> queryReservationsByUserId(@Param("userId") Long userId, @Param("category") int category, @Param("sort") int sort, Pageable p);

    @Query("""
    SELECT DISTINCT l.stationName AS userHomeStationName,
           r.id AS reservationId,
           r.startDate AS startDate,
           r.direction AS direction,
           r.arrivalTime AS expectedArrivalTime,
           r.departureTime AS expectedDepartureTime,
           bs_arrival.departureTime AS realDepartureTime,
           bs_arrival.arrivalTime AS realArrivalTime,
           r.status AS reservationStatus,
           bs_arrival.id AS busScheduleId,
           b.id AS busId,
           bs_arrival.status AS busStatus,
           bs.roadNameAddress AS busStopRoadNameAddress,
           bs.expectedArrivalTime AS busStopArrivalTime
    FROM Reservation r
    LEFT JOIN Ticket t ON r.id = t.reservation.id
    LEFT JOIN BusStop bs ON t.busStopId = bs.id
    LEFT JOIN BusSchedule bs_arrival ON bs_arrival.id = t.busScheduleId
    LEFT JOIN Bus b ON bs_arrival.bus.id = b.id
    LEFT JOIN Location l ON l.reservationId = r.id
    WHERE r.id = :reservationId AND r.userId = :userId
    """)
    Optional<UserReservationProjection> queryReservationByReservationIdAndUserId(@Param("reservationId") Long reservationId, @Param("userId") Long userId);

    @Query("""
        SELECT DISTINCT null AS userHomeStationName,
           t.reservation.id AS reservationId,
           t.reservation.startDate AS startDate,
           t.reservation.direction AS direction,
           t.reservation.arrivalTime AS expectedArrivalTime,
           t.reservation.departureTime AS expectedDepartureTime,
           bs_arrival.departureTime AS realDepartureTime,
           bs_arrival.arrivalTime AS realArrivalTime,
           t.reservation.status AS reservationStatus,
           bs_arrival.id AS busScheduleId,
           bs_arrival.bus.id AS busId,
           bs_arrival.status AS busStatus,
           bs.roadNameAddress AS busStopRoadNameAddress,
           bs.expectedArrivalTime AS busStopArrivalTime
    FROM Ticket t
    JOIN BusSchedule bs_arrival ON t.busScheduleId = :busScheduleId
    JOIN BusStop bs ON t.busStopId = bs.id
    WHERE bs_arrival.id = :busScheduleId AND t.busScheduleId = :busScheduleId AND t.reservation.userId = :userId
        AND t.reservation.status = 'ALLOCATED' AND (bs_arrival.status = 'RUNNING' OR bs_arrival.status = 'READY')
    """)
    Optional<UserReservationProjection> queryReservationByBusScheduleIdAndUserId(@Param("userId") Long userId, @Param("busScheduleId") Long busScheduleId);

    @Query("""
        SELECT DISTINCT
                CASE
                    WHEN r.direction = 'TO_SCHOOL' THEN r.arrivalTime
                    ELSE r.departureTime
                END AS reservedTime
            FROM Reservation r
            WHERE r.status != 'CANCELED'
            AND r.userId = :userId
    """)
    List<LocalDateTime> findReservedTimeByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT DISTINCT
            CASE WHEN r.direction = 'TO_SCHOOL' THEN r.arrivalTime
                ELSE r.departureTime
            END AS reserveTime
        FROM Reservation r
        WHERE r.userId = :userId
        AND r.status != 'CANCELED'
        AND ((r.arrivalTime is not null and r.arrivalTime in :time) OR
            (r.departureTime is not null and r.departureTime in :time))
    """)
    List<LocalDateTime> findDuplicatedReservationTime(@Param("userId") Long userId, @Param("time") List<LocalDateTime> times);

}
