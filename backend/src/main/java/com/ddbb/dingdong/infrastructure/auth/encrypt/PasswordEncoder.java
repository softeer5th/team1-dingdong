package com.ddbb.dingdong.infrastructure.auth.encrypt;

import com.ddbb.dingdong.infrastructure.auth.encrypt.utils.SHA512Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.security.SecureRandom;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class PasswordEncoder {
    private static final int HASH_ITERATIONS = 12;
    private static final int SALT_LENGTH = 16;
    private final SHA512Encoder encoder;
    public String encode(String rawPassword) {
        byte[] salt = generateSalt();
        return encodePassword(rawPassword, salt, HASH_ITERATIONS);
    }

    public boolean matches(String rawPassword, String encryptedPassword) {
        String[] parts = encryptedPassword.split("\\$");
        if (parts.length != 3) {
            return false;
        }
        int iterations = Integer.parseInt(parts[0]);
        byte[] salt = Base64.getDecoder().decode(parts[1]);
        String expectedHash = encodePassword(rawPassword, salt, iterations);

        return expectedHash.equals(encryptedPassword);
    }

    private String encodePassword(String rawPassword, byte[] salt, int iterations) {
        String hashedPassword = encoder.hashWithSalt(rawPassword, salt);

        for (int i = 0; i < (1 << iterations); i++) {
            hashedPassword = encoder.hash(hashedPassword);
        }

        String base64Salt = Base64.getEncoder().encodeToString(salt);
        return iterations + "$" + base64Salt + "$" + hashedPassword;
    }

    private byte[] generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }
}