package com.ddbb.dingdong.domain.user.service;

import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.repository.UserRepository;
import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.AuthenticationManager;
import com.ddbb.dingdong.infrastructure.auth.encrypt.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserManagement {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public void login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(UserErrors.NOT_FOUND::toException);
        if(!passwordEncoder.matches(password, user.getPassword())) throw UserErrors.NOT_MATCHED_PASSWORD.toException();
        authenticationManager.setAuthentication(new AuthUser(user.getId()));
    }

    public User load(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserErrors.NOT_FOUND::toException);
    }
}
