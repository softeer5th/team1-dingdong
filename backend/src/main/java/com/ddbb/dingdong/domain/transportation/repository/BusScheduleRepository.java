package com.ddbb.dingdong.domain.transportation.repository;

import com.ddbb.dingdong.domain.transportation.entity.BusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
}
