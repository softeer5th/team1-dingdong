package com.ddbb.dingdong.domain.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Home {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double houseLatitude;

    @Column(nullable = false)
    private Double houseLongitude;

    private Double stationLatitude;

    private Double stationLongitude;

    private String stationName;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
