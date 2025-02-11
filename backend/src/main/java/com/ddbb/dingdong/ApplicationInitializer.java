//package com.ddbb.dingdong;
//
//import com.ddbb.dingdong.domain.clustering.entity.Location;
//import com.ddbb.dingdong.domain.clustering.repository.LocationRepository;
//import com.ddbb.dingdong.domain.payment.entity.Wallet;
//import com.ddbb.dingdong.domain.payment.repository.WalletRepository;
//import com.ddbb.dingdong.domain.reservation.entity.Reservation;
//import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
//import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
//import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationType;
//import com.ddbb.dingdong.domain.reservation.repository.ReservationRepository;
//import com.ddbb.dingdong.domain.user.entity.Home;
//import com.ddbb.dingdong.domain.user.entity.School;
//import com.ddbb.dingdong.domain.user.entity.User;
//import com.ddbb.dingdong.domain.user.repository.UserRepository;
//import com.ddbb.dingdong.infrastructure.auth.encrypt.PasswordEncoder;
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import lombok.extern.slf4j.Slf4j;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class ApplicationInitializer {
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final ReservationRepository reservationRepository;
//    private final WalletRepository walletRepository;
//    private final LocationRepository locationRepository;
//
//    @Transactional
//    @PostConstruct
//    public void init() {
//
//        School school = new School();
//        school.setId(1L);
//        if (userRepository.findByEmail("test@test.com").isEmpty()) {
//            String password = passwordEncoder.encode("abcd1234!@");
//            Home home = new Home(null, 37.5143, 127.0294, 37.513716, 127.029790, "에티버스");
//            User user = new User(null, "test", "test@test.com", password, LocalDateTime.now(), school, home);
//            Wallet wallet = new Wallet();
//            wallet.setBalance(10000);
//            Long userId = userRepository.save(user).getId();
//            wallet.setUserId(userId);
//            walletRepository.save(wallet);
//
//            Reservation reservation = new Reservation();
//            reservation.setUserId(userId);
//            reservation.setType(ReservationType.GENERAL);
//            reservation.setDirection(Direction.TO_SCHOOL);
//            reservation.setStartDate(LocalDate.of(2025, 2, 20));
//            reservation.setArrivalTime(LocalDateTime.of(2025, 2, 20, 12, 0, 0));
//            reservation.setStatus(ReservationStatus.PENDING);
//            Long reservationId = reservationRepository.save(reservation).getId();
//
//            Location location = new Location();
//            location.setLatitude(home.getStationLatitude());
//            location.setLongitude(home.getStationLongitude());
//            location.setReservationId(reservationId);
//
//            locationRepository.save(location);
//
//        }
//
//
//        if (userRepository.findByEmail("test2@test.com").isEmpty()) {
//            String password = passwordEncoder.encode("abcd1234!@");
//            Home home = new Home(null, 37.5143, 127.0294, 37.516716, 127.032790,"에티버스");
//            User user = new User(null, "test", "test2@test.com", password, LocalDateTime.now(), school, home);
//
//            Wallet wallet = new Wallet();
//            wallet.setBalance(10000);
//            Long userId = userRepository.save(user).getId();
//            wallet.setUserId(userId);
//            walletRepository.save(wallet);
//
//            Reservation reservation = new Reservation();
//            reservation.setUserId(userId);
//            reservation.setType(ReservationType.GENERAL);
//            reservation.setDirection(Direction.TO_SCHOOL);
//            reservation.setStartDate(LocalDate.of(2025, 2, 20));
//            reservation.setArrivalTime(LocalDateTime.of(2025, 2, 20, 12, 0, 0));
//            reservation.setStatus(ReservationStatus.PENDING);
//            Long reservationId = reservationRepository.save(reservation).getId();
//
//            Location location = new Location();
//            location.setLatitude(home.getStationLatitude());
//            location.setLongitude(home.getStationLongitude());
//            location.setReservationId(reservationId);
//
//            locationRepository.save(location);
//
//        }
//
//        if (userRepository.findByEmail("test3@test.com").isEmpty()) {
//            String password = passwordEncoder.encode("abcd1234!@");
//            Home home = new Home(null, 37.5143, 127.0294, 37.511716, 127.022790,"에티버스");
//            User user = new User(null, "test", "test3@test.com", password, LocalDateTime.now(), school, home);
//
//            Wallet wallet = new Wallet();
//            wallet.setBalance(10000);
//            Long userId = userRepository.save(user).getId();
//            wallet.setUserId(userId);
//            walletRepository.save(wallet);
//
//            Reservation reservation = new Reservation();
//            reservation.setUserId(userId);
//            reservation.setType(ReservationType.GENERAL);
//            reservation.setDirection(Direction.TO_SCHOOL);
//            reservation.setStartDate(LocalDate.of(2025, 2, 20));
//            reservation.setArrivalTime(LocalDateTime.of(2025, 2, 20, 12, 0, 0));
//            reservation.setStatus(ReservationStatus.PENDING);
//            Long reservationId = reservationRepository.save(reservation).getId();
//
//            Location location = new Location();
//            location.setLatitude(home.getStationLatitude());
//            location.setLongitude(home.getStationLongitude());
//            location.setReservationId(reservationId);
//
//            locationRepository.save(location);
//
//        }
//
//        if (userRepository.findByEmail("tes4t@test.com").isEmpty()) {
//            String password = passwordEncoder.encode("abcd1234!@");
//            Home home = new Home(null, 37.5143, 127.0294, 37.515716, 127.031790,"에티버스");
//            User user = new User(null, "test", "test4@test.com", password, LocalDateTime.now(), school, home);
//
//            Wallet wallet = new Wallet();
//            wallet.setBalance(10000);
//            Long userId = userRepository.save(user).getId();
//            wallet.setUserId(userId);
//            walletRepository.save(wallet);
//
//            Reservation reservation = new Reservation();
//            reservation.setUserId(userId);
//            reservation.setType(ReservationType.GENERAL);
//            reservation.setDirection(Direction.TO_SCHOOL);
//            reservation.setStartDate(LocalDate.of(2025, 2, 20));
//            reservation.setArrivalTime(LocalDateTime.of(2025, 2, 20, 12, 0, 0));
//            reservation.setStatus(ReservationStatus.PENDING);
//            Long reservationId = reservationRepository.save(reservation).getId();
//
//            Location location = new Location();
//            location.setLatitude(home.getStationLatitude());
//            location.setLongitude(home.getStationLongitude());
//            location.setReservationId(reservationId);
//
//            locationRepository.save(location);
//        }
//
//
//        if (userRepository.findByEmail("test5@test.com").isEmpty()) {
//            String password = passwordEncoder.encode("abcd1234!@");
//            Home home = new Home(null, 32.5143, 124.0294, 32.515716, 121.031790, "외지");
//            User user = new User(null, "test", "test5@test.com", password, LocalDateTime.now(), school, home);
//
//            Wallet wallet = new Wallet();
//            wallet.setBalance(10000);
//            Long userId = userRepository.save(user).getId();
//            wallet.setUserId(userId);
//            walletRepository.save(wallet);
//        }
//
//    }
//
//}
