package com.ddbb.dingdong.auth;

import com.ddbb.dingdong.infrastructure.auth.encrypt.utils.SHA512Encoder;
import com.ddbb.dingdong.infrastructure.auth.encrypt.PasswordEncoder;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PasswordEncoderTest {
    private final SHA512Encoder SHA512Encoder = new SHA512Encoder();
    private final PasswordEncoder PasswordEncoder = new PasswordEncoder(SHA512Encoder);

    @Test
    @DisplayName("패스워드 암호화 테스트")
    void testPasswordEncoder() {
        String rawPassword = "test";
        String encryptPassword = PasswordEncoder.encode(rawPassword);
        System.out.println(encryptPassword);
        Assertions.assertThat(PasswordEncoder.matches(rawPassword, encryptPassword)).isTrue();
    }

}
