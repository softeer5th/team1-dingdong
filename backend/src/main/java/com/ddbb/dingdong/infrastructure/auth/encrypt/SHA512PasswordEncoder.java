package com.ddbb.dingdong.infrastructure.auth.encrypt;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class SHA512PasswordEncoder {
    private static final String HASH_ALGORITHM = "SHA-512";
    private static final int HASH_ITERATIONS = 12;
    private static final int SALT_LENGTH = 16;

    public String encode(String rawPassword) {
        byte[] salt = generateSalt();
        return encodePassword(rawPassword, salt, HASH_ITERATIONS);
    }

    public boolean matches(String rawPassword, String encryptedPassword) {
        String[] parts = encryptedPassword.split("\\$");
        if(parts.length != 2) { return false; }
        int iterations = Integer.parseInt(parts[0]);
        byte[] salt = Base64.getDecoder().decode(parts[1]);
        String expectedHash = encodePassword(rawPassword, salt, iterations);

        return expectedHash.equals(encryptedPassword);
    }

    private String encodePassword(String rawPassword, byte[] salt, int iterations) {
        try {
            MessageDigest md = MessageDigest.getInstance(HASH_ALGORITHM);

            md.update(salt);
            byte[] encryptedPassword = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));

            for (int i = 0; i < (1 << iterations); i++) {
                md.update(encryptedPassword);
                encryptedPassword = md.digest();
            }

            String base64Salt = Base64.getEncoder().encodeToString(salt);
            String base64Hash = Base64.getEncoder().encodeToString(encryptedPassword);
            return iterations + "$" + base64Salt + "$" + base64Hash;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-512 algorithm not found", e);
        }
    }

    private byte[] generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }
}