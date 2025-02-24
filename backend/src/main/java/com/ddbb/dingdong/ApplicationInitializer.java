package com.ddbb.dingdong;

import com.ddbb.dingdong.application.usecase.auth.SignUpUseCase;
import com.ddbb.dingdong.domain.notification.entity.Notification;
import com.ddbb.dingdong.domain.notification.entity.vo.NotificationType;
import com.ddbb.dingdong.domain.notification.repository.NotificationRepository;
import com.ddbb.dingdong.domain.payment.entity.Wallet;
import com.ddbb.dingdong.domain.payment.repository.WalletRepository;
import com.ddbb.dingdong.domain.user.entity.Home;
import com.ddbb.dingdong.domain.user.entity.School;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import com.ddbb.dingdong.domain.user.entity.User;
import com.ddbb.dingdong.domain.user.entity.vo.Role;
import com.ddbb.dingdong.domain.user.repository.SchoolRepository;
import com.ddbb.dingdong.domain.user.repository.UserRepository;
import com.ddbb.dingdong.infrastructure.auth.encrypt.password.PasswordEncoder;
import com.ddbb.dingdong.presentation.endpoint.auth.exchanges.SignUpRequestDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    private final SignUpUseCase signUpUseCase;
    private static final String adminEmail = "admin@admin.com";
    private static School school;
    private final NotificationRepository notificationRepository;

    @Transactional
    @PostConstruct
    public void init() {

        school = schoolRepository.findByName("서울대학교").orElse(null);

        if (school == null) {
            school = new School(null, "서울대학교", "서울대학교", 37.4602, 126.9527);
            school = schoolRepository.save(school);
            adminSignUp();

            for (int i = 0 ; i < 30; i++) {
                autoSignUp(i);
                Notification notification = new Notification();
                notification.setUserId((long)(i + 1));
                notification.setReservationId(null);
                notification.setType(NotificationType.WELCOME);
                notification.setMoney(30000);

                notificationRepository.save(notification);
            }
        }
    }

    private void adminSignUp() {
        Home home = new Home(null, 37.5143, 127.0294, 37.513716, 127.029790, "에티버스" ,"학동로 180");
        Timetable timetable = new Timetable();
        User user = new User(null, "admin", "admin@admin.com", passwordEncoder.encode("Abcd1234!@"), Role.ADMIN, LocalDateTime.now(), school, null, timetable);
        user.associateHome(home);
        user = userRepository.save(user);
        Wallet wallet = new Wallet(null, user.getId(), 1000000, LocalDateTime.now(), new ArrayList<>());
        walletRepository.save(wallet);
    }

    public void autoSignUp(int testId) {

//        Home home = new Home(null, 37.5143, 127.0294, 37.513716, 127.029790, "에티버스" ,"학동로 180");
        String email = testId == 0 ? "test@test.com" : "test" +testId + "@test.com";
        signUpUseCase.execute(
                new SignUpUseCase.Param(
                        "테스트계정",
                        email,
                        "Abcd1234!@",
                        new SignUpRequestDto.Home(
                                37.5143,
                                127.0294,
                                "학동로 171"
                        ),
                        1L
                )
        );
    }
}
