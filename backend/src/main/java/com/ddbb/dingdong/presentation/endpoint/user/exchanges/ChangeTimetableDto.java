package com.ddbb.dingdong.presentation.endpoint.user.exchanges;

import lombok.Getter;

import java.time.LocalTime;

@Getter
public class ChangeTimetableDto {
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
