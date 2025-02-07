package com.ddbb.dingdong.domain.reservation.repository;

import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

}
