package com.ddbb.dingdong.domain.transportation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private BigDecimal latitude;

    @Column(nullable = false)
    private BigDecimal longitude;

    @ManyToOne
    @JoinColumn(name = "path_id")
    private Path path;
}
