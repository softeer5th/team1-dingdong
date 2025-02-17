package com.ddbb.dingdong;

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
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitializer {
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;
    private static final String adminEmail = "admin@admin.com";
    private static School school;
    @PostConstruct
    public void init() {

        school = schoolRepository.findByName("서울대학교").orElse(null);

        if(school == null) {
            school = new School(null, "서울대학교", "서울대학교", 37.4602, 126.9527);
            school = schoolRepository.save(school);
            adminSignUp();
        }

        if (userRepository.findByEmail("test@test.com").isEmpty()) {
            String password = passwordEncoder.encode("abcd1234!@");
            school = schoolRepository.save(school);

            for (int i = 0 ; i < 30; i++) {
                autoSignUp(i, password);
            }
        }
    }

    private void adminSignUp() {
        Home home = new Home(null, 37.5143, 127.0294, 37.513716, 127.029790, "에티버스" ,"학동로 180");
        Timetable timetable = new Timetable();
        User user = new User(null, "admin", "admin@admin.com", "abcd1234!@", Role.ADMIN, LocalDateTime.now(), school, null, timetable);
        user.associateHome(home);
        user = userRepository.save(user);
        Wallet wallet = new Wallet(null, user.getId(), 1000000, LocalDateTime.now(), new ArrayList<>());
        walletRepository.save(wallet);
    }

    private void autoSignUp(int testId, String password) {
        Home home = new Home(null, 37.5143, 127.0294, 37.513716, 127.029790, "에티버스" ,"학동로 180");
        String email = testId == 0 ? "test@test.com" : "test" +testId + "@test.com";
        Timetable timetable = new Timetable();
        User user = new User(null, "test", email, password, Role.USER, LocalDateTime.now(), school, null,timetable);
        user.associateHome(home);
        user = userRepository.save(user);
        Wallet wallet = new Wallet(null, user.getId(), 50000, LocalDateTime.now(), new ArrayList<>());
        walletRepository.save(wallet);
    }
}
