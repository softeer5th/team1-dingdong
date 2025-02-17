package com.ddbb.dingdong.application.usecase.bus;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.transportation.repository.BusScheduleQueryRepository;
import com.ddbb.dingdong.domain.transportation.repository.projection.ScheduleTimeProjection;
import com.ddbb.dingdong.domain.user.repository.UserQueryRepository;
import com.ddbb.dingdong.domain.user.service.error.UserErrors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetBusSchedulesUseCase implements UseCase<GetBusSchedulesUseCase.Param, GetBusSchedulesUseCase.Response> {
    private final UserQueryRepository userRepository;
    private final BusScheduleQueryRepository busScheduleRepository;

    @Override
    @Transactional(readOnly = true)
    public Response execute(Param param) {
        Long schoolId = userRepository.findSchoolIDByUserId(param.getUserId())
                .orElseThrow(UserErrors.NOT_FOUND::toException)
                .getSchoolId();
        List<ScheduleTimeProjection> times = switch (param.getDirection()) {
            case TO_SCHOOL -> busScheduleRepository.findAvailableGoSchoolBusTime(schoolId);
            case TO_HOME -> busScheduleRepository.findAvailableGoHomeBusTime(schoolId);
        };
        List<LocalDateTime> results = times.stream()
                .map(ScheduleTimeProjection::getTime)
                .toList();
        return new Response(results);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private Direction direction;
    }

    @Getter
    @AllArgsConstructor
    public static class Response {
        private List<LocalDateTime> schedules;
    }
}
