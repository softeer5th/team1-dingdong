package com.ddbb.dingdong.domain.transportation.entity;

import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private Long schoolId;

    @OneToOne(cascade = CascadeType.ALL)
    private Bus bus;

    @OneToOne(mappedBy = "busSchedule", cascade = CascadeType.ALL)
    private Path path;
}
