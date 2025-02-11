//package com.ddbb.dingdong.domain.user.repository.userRepository;
//
//import com.ddbb.dingdong.domain.user.entity.Home;
//import com.ddbb.dingdong.domain.user.entity.School;
//import com.ddbb.dingdong.domain.user.entity.User;
//import com.ddbb.dingdong.domain.user.repository.UserQueryRepository;
//import com.ddbb.dingdong.domain.user.repository.projection.UserStaticOnly;
//import com.ddbb.dingdong.infrastructure.auth.encrypt.utils.SHA512Encoder;
//import com.ddbb.dingdong.infrastructure.auth.encrypt.PasswordEncoder;
//import org.junit.jupiter.api.Assertions;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@SpringBootTest
//class GetStaticInfoTest {
//    @Autowired
//    private UserQueryRepository userQueryRepository;
//    private SHA512Encoder sha512Encoder = new SHA512Encoder();
//    private PasswordEncoder encoder = new PasswordEncoder(sha512Encoder);
//    private String password = encoder.encode("123456");
//    private School school = new School(null, "seoul", "seoul", new BigDecimal("1.0"), new BigDecimal("1.0"));
//
//    private Home home = new Home(null, 1.0, 1.0, 1.0, null,"address", new User());
//    private User user = new User(null, "test", "test@test.com", password, LocalDateTime.now(), school,home);
//
//
//    @Test
//    @Transactional
//    public void success() {
//        User saved = userQueryRepository.save(user);
//        Optional<UserStaticOnly> optional = this.userQueryRepository.findUserStaticInfoById(saved.getId());
//
//        if (optional.isEmpty()) {
//            Assertions.fail();
//        }
//        UserStaticOnly userStaticOnly = optional.get();
//        Assertions.assertEquals(user.getEmail(), userStaticOnly.getEmail());
//        Assertions.assertEquals(user.getName(), userStaticOnly.getUserName());
//        Assertions.assertEquals(school.getName(), userStaticOnly.getSchoolName());
//    }
//}