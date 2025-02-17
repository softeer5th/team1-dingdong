package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.auth.service.error.AuthErrors;
import com.ddbb.dingdong.domain.payment.entity.Wallet;
import com.ddbb.dingdong.domain.payment.repository.WalletRepository;
import com.ddbb.dingdong.domain.user.entity.Home;
import com.ddbb.dingdong.domain.user.entity.School;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.entity.vo.Role;
import com.ddbb.dingdong.domain.user.repository.SchoolRepository;
import com.ddbb.dingdong.domain.user.repository.UserRepository;
import com.ddbb.dingdong.infrastructure.auth.encrypt.PasswordEncoder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class FastSignUpUseCase implements UseCase<FastSignUpUseCase.Param, Void> {
    private static final int INFINITE_MONEY = 1_000_000_000;

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;

    @Transactional
    @Override
    public Void execute(Param param) {
        String password = passwordEncoder.encode(param.getPassword());
        School school = schoolRepository.findById(1L)
                .orElseThrow(AuthErrors.SCHOOL_NOT_FOUND::toException);
        Home home = new Home(
                null, 37.5143, 127.0294,
                param.stationLatitude, param.stationLongitude,
                "Test Station",
                param.houseRoadNameAddress
        );
        Timetable timetable = new Timetable();

        User user = new User(
                null, param.name, param.email, password, Role.USER, LocalDateTime.now(),
                school,
                home, timetable
        );

        user = userRepository.save(user);
        Wallet wallet = new Wallet(null, user.getId(), INFINITE_MONEY, LocalDateTime.now(), new ArrayList<>());
        walletRepository.save(wallet);
        return null;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private String name;
        private String email;
        private String password;
        private String houseRoadNameAddress;
        private Double stationLatitude;
        private Double stationLongitude;
    }
}
