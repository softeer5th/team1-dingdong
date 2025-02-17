package com.ddbb.dingdong.domain.user.repository;

import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.repository.projection.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserQueryRepository extends JpaRepository<User, Long> {
    @Query("SELECT u.name as userName, s.name as schoolName, u.email as email,  " +
            "s.latitude as schoolLatitude, s.longitude as schoolLongitude " +
            "FROM User u JOIN u.school s WHERE u.id = :id")
    Optional<UserStaticOnly> findUserStaticInfoById(Long id);

    @Query("SELECT h.houseLatitude AS houseLatitude, h.houseLongitude AS houseLongitude, " +
            "h.stationName AS stationName, h.stationLatitude AS stationLatitude, h.stationLongitude AS stationLongitude " +
            "FROM User u JOIN u.home h WHERE u.id = :userId")
    Optional<HomeLocationProjection> queryHomeLocationByUserId(@Param("userId") Long userId);

    @Query("SELECT u.school.id as schoolId FROM User u WHERE u.id = :userId")
    Optional<SchoolIdProjection> findSchoolIDByUserId(@Param("userId") Long userId);

    @Query("SELECT u.school.id as schoolId, u.home.stationLatitude as stationLatitude, u.home.stationLongitude as stationLongitude " +
            "FROM User u " +
            "WHERE u.id = :userId")
    Optional<HomeStationProjection> findHomeStationLocationWithSchoolId(@Param("userId") Long userId);
}
