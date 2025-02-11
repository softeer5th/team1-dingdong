package com.ddbb.dingdong.domain.clustering.repository;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findAllByClusterLabel(String clusterLabel);

    @Query("""
    SELECT l
    FROM Location l, Reservation r
    WHERE r.id = l.reservationId
    AND CAST(r.status AS STRING) = 'PENDING'
    AND (
        (:direction = 0) AND (r.arrivalTime = :dingdongTime)
        OR
        (:direction = 1) AND (r.departureTime = :dingdongTime)
        )
    """)
    List<Location> findAllByDirectionAndDingdongTimeWherePending(@Param("direction") int direction, LocalDateTime dingdongTime);
}