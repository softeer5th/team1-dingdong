package com.ddbb.dingdong.domain.transportation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Path {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double totalDistance;

    @Column(nullable = false)
    private Integer totalMinutes;

    @OneToMany(mappedBy = "path", cascade = CascadeType.PERSIST)
    private List<Line> lines;

    @OneToOne
    @JoinColumn(name = "bus_schedule_id")
    private BusSchedule busSchedule;

    @OneToMany(mappedBy = "path", cascade = CascadeType.ALL)
    private List<BusStop> busStop;
}
