package com.ddbb.dingdong.domain.clustering.repository;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.repository.projection.PendingLocationsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LocationQueryRepository extends JpaRepository<Location, Long> {

    @Query("""
    SELECT
        l.clusterLabel AS clusterLabel,
        l.latitude AS latitude,
        l.longitude AS longitude
    FROM
        Location l, Reservation r
    WHERE
        (l.reservationId = r.id) AND (CAST(r.status AS STRING) = 'PENDING')
        AND
        (
            (:direction = 0 AND (CAST(r.direction AS STRING) = 'TO_SCHOOL') AND r.arrivalTime = :dingdongTime)
        OR
            (:direction = 1 AND (CAST(r.direction AS STRING) = 'TO_HOME') AND r.departureTime = :dingdongTime)
        )
    """)
    List<PendingLocationsProjection> findPendingLocationsByDirectionAndTime(@Param("direction") int direction, @Param("dingdongTime") LocalDateTime dingdongTime);
}
