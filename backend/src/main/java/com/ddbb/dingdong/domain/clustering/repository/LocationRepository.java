package com.ddbb.dingdong.domain.clustering.repository;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}
