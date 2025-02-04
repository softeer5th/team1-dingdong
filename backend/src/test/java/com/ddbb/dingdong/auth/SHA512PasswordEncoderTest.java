package com.ddbb.dingdong.auth;

import com.ddbb.dingdong.infrastructure.auth.encrypt.SHA512PasswordEncoder;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class SHA512PasswordEncoderTest {
    private final SHA512PasswordEncoder SHA512PasswordEncoder = new SHA512PasswordEncoder();

    @Test
    @DisplayName("패스워드 암호화 테스트")
    void testPasswordEncoder() {
        String rawPassword = "abcd1234!@";
        String encryptPassword = SHA512PasswordEncoder.encode(rawPassword);
        System.out.println(encryptPassword);
        Assertions.assertThat(SHA512PasswordEncoder.matches(rawPassword, encryptPassword)).isTrue();
    }

}
