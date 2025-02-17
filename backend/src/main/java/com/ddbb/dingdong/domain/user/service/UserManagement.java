package com.ddbb.dingdong.domain.user.service;

import com.ddbb.dingdong.domain.user.entity.Timetable;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.repository.UserRepository;
import com.ddbb.dingdong.domain.user.service.error.UserErrors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserManagement {
    private final UserRepository userRepository;

    public User load(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserErrors.NOT_FOUND::toException);
    }

    public void changeTimetable(Long userId, Timetable newTimetable) {
        User user = userRepository.findById(userId).orElseThrow(UserErrors.NOT_FOUND::toException);
        user.changeTimetable(newTimetable);
    }
}
