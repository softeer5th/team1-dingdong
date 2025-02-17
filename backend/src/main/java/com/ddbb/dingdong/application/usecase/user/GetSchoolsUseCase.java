package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.user.entity.School;
import com.ddbb.dingdong.domain.user.repository.SchoolRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetSchoolsUseCase implements UseCase<GetSchoolsUseCase.Param, GetSchoolsUseCase.Result> {
    private final SchoolRepository schoolRepository;

    @Transactional(readOnly = true)
    @Override
    public Result execute(Param param) {
        List<School> schools = schoolRepository.findAll();

        return new Result(schools.stream().map( school -> new Result.SchoolInfo(school.getId(), school.getName())).toList());
    }

    public static class Param implements Params {

    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private List<SchoolInfo> schools;

        @Getter
        @AllArgsConstructor
        public static class SchoolInfo {
            private Long schoolId;
            private String schoolName;
        }
    }
}
