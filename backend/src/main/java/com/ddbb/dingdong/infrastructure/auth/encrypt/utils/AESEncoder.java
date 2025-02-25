package com.ddbb.dingdong.infrastructure.auth.encrypt.utils;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class AESEncoder {
    private static final String AES = "AES";
    private static final String AES_GCM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final byte[] IV = new byte[12];
    private static byte[] SERVER_KEY;
    @Value("${security.secret.aes}")
    private String secret;

    @PostConstruct
    public void init() {
        SERVER_KEY = secret.getBytes(StandardCharsets.UTF_8);
    }

    public String encrypt(String data) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_GCM);
        SecretKeySpec secretKey = new SecretKeySpec(SERVER_KEY, AES);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, IV));

        byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public String decrypt(String encryptedData) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_GCM);
        SecretKeySpec secretKey = new SecretKeySpec(SERVER_KEY, AES);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, IV));

        byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
        return new String(cipher.doFinal(decodedBytes), StandardCharsets.UTF_8);
    }
}