package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.service.UserManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class GetTimetableUseCase implements UseCase<GetTimetableUseCase.Param, GetTimetableUseCase.Result> {
    private final UserManagement userManagement;

    @Transactional(readOnly = true)
    @Override
    public Result execute(Param param) {
        Long userId = param.getUserId();
        User user = userManagement.load(userId);
        Timetable timetable = user.getTimetable();

        return new Result(
                timetable.getMonStartTime(),
                timetable.getMonEndTime(),
                timetable.getTueStartTime(),
                timetable.getTueEndTime(),
                timetable.getWedStartTime(),
                timetable.getWedEndTime(),
                timetable.getThuStartTime(),
                timetable.getThuEndTime(),
                timetable.getFriStartTime(),
                timetable.getFriEndTime()
        );
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        Long userId;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        LocalTime monStartTime;
        LocalTime monEndTime;
        LocalTime tueStartTime;
        LocalTime tueEndTime;
        LocalTime wedStartTime;
        LocalTime wedEndTime;
        LocalTime thuStartTime;
        LocalTime thuEndTime;
        LocalTime friStartTime;
        LocalTime friEndTime;
    }
}
