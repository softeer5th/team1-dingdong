package com.ddbb.dingdong.domain.transportation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Path {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal totalDistance;

    @Column(nullable = false)
    private Long totalTime;

    @OneToOne
    @JoinColumn(name = "bus_schedule_id")
    private BusSchedule busSchedule;

    @OneToMany(mappedBy = "path")
    private List<Point> points;

    @OneToMany(mappedBy = "path")
    private List<BusStop> busStop;
}
