package com.ddbb.dingdong.domain.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Timetable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalTime monStartTime;
    private LocalTime monEndTime;

    private LocalTime tueStartTime;
    private LocalTime tueEndTime;

    private LocalTime wedStartTime;
    private LocalTime wedEndTime;

    private LocalTime thuStartTime;
    private LocalTime thuEndTime;

    private LocalTime friStartTime;
    private LocalTime friEndTime;
}
