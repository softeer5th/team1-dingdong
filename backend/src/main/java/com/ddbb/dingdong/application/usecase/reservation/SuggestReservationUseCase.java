package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.service.UserManagement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuggestReservationUseCase implements UseCase<SuggestReservationUseCase.Param, SuggestReservationUseCase.Result> {
    private final ReservationManagement reservationManagement;
    private final UserManagement userManagement;

    @Transactional(readOnly = true)
    @Override
    public Result execute(Param param) {
        return suggestDates(param);
    }

    private Result suggestDates(Param param) {
        Long userId = param.getUserId();
        User user = userManagement.load(userId);
        Timetable timetable = user.getTimetable();
        Direction direction = param.getDirection();
        YearMonth yearMonth = param.getYearMonth();
        List<LocalDateTime> suggestedDates = reservationManagement.recommendReservationDates(yearMonth, direction, timetable);

        return new Result(suggestedDates);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private Direction direction;
        private YearMonth yearMonth;
    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        List<LocalDateTime> suggestionDates;
    }
}
