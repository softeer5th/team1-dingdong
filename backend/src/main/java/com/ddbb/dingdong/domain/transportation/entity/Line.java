package com.ddbb.dingdong.domain.transportation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Line {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private Integer totalMeters;

    @Column(nullable = false)
    private Integer totalMinutes;

    @OneToMany(mappedBy = "line")
    private List<Point> points;

    @ManyToOne
    @JoinColumn(name = "path_id")
    private Path path;
}
