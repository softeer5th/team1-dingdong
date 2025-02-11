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
public class Line {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private Integer totalMeters;

    @Column(nullable = false)
    private Integer totalSeconds;

    @OneToMany(mappedBy = "line", cascade = CascadeType.ALL)
    private List<Point> points;

    @ManyToOne
    @JoinColumn(name = "path_id")
    private Path path;
}
