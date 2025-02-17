package com.ddbb.dingdong.domain.user.entity;

import com.ddbb.dingdong.domain.user.entity.vo.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = null;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(cascade = CascadeType.MERGE ,fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @OneToOne(cascade = CascadeType.ALL)
    private Home home;

    @OneToOne(cascade = CascadeType.ALL)
    private Timetable timetable;

    public void associateHome(Home home) {
        this.home = home;
    }

    public void updateStation(String stationName, String roadAddressName, Double latitude, Double longitude) {
        this.home.setStationLatitude(latitude);
        this.home.setStationLongitude(longitude);
        this.home.setStationName(stationName);
        this.home.setStationRoadAddressName(roadAddressName);
    }

    public void changeTimetable(Timetable timetable) {
        this.timetable.setMonStartTime(timetable.getMonStartTime());
        this.timetable.setMonEndTime(timetable.getMonEndTime());
        this.timetable.setTueStartTime(timetable.getTueStartTime());
        this.timetable.setTueEndTime(timetable.getTueEndTime());
        this.timetable.setWedStartTime(timetable.getWedStartTime());
        this.timetable.setWedEndTime(timetable.getWedEndTime());
        this.timetable.setThuStartTime(timetable.getThuStartTime());
        this.timetable.setThuEndTime(timetable.getThuEndTime());
        this.timetable.setFriStartTime(timetable.getFriStartTime());
        this.timetable.setFriEndTime(timetable.getFriEndTime());
    }
}
