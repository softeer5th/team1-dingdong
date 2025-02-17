package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.usecase.user.error.UserInvalidParamErrors;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import com.ddbb.dingdong.domain.user.service.UserManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ChangeTimetableUseCase implements UseCase<ChangeTimetableUseCase.Param, Void> {
    private final UserManagement userManagement;

    @Transactional
    @Override
    public Void execute(Param param) {
        param.validate();
        changeTimetable(param);

        return null;
    }

    private void changeTimetable(Param param) {
        Long userId = param.getUserId();
        Timetable newTimetable = new Timetable(
                null,
                param.getMonStartTime(),
                param.getMonEndTime(),
                param.getTueStartTime(),
                param.getTueEndTime(),
                param.getWedStartTime(),
                param.getWedEndTime(),
                param.getThuStartTime(),
                param.getThuEndTime(),
                param.getFriStartTime(),
                param.getFriEndTime()
        );

        userManagement.changeTimetable(userId, newTimetable);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        Long userId;
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

        @Override
        public boolean validate() {
            validateTime(monStartTime, monEndTime);
            validateTime(monStartTime, monEndTime);
            validateTime(monStartTime, monEndTime);
            validateTime(monStartTime, monEndTime);
            validateTime(monStartTime, monEndTime);

            return true;
        }

        private void validateTime(LocalTime startTime, LocalTime endTime) {

            if(startTime != null && startTime.getMinute() != 0 && startTime.getMinute() != 30) {
                throw UserInvalidParamErrors.INVALID_TIMETABLE_MINUTES.toException();
            }

            if(endTime != null && endTime.getMinute() != 0 && endTime.getMinute() != 30) {
                throw UserInvalidParamErrors.INVALID_TIMETABLE_MINUTES.toException();
            }

            if(startTime != null && endTime != null && startTime.isAfter(endTime)) {
                throw UserInvalidParamErrors.TIMETABLE_FINISH_BEFORE_START.toException();
            }
        }
    }
}
