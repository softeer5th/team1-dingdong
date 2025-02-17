package com.ddbb.dingdong.infrastructure.firebase;

import com.ddbb.dingdong.infrastructure.firebase.entity.FCMToken;
import com.ddbb.dingdong.infrastructure.firebase.error.FCMError;
import com.ddbb.dingdong.infrastructure.firebase.error.FCMException;
import com.ddbb.dingdong.infrastructure.firebase.repository.FCMTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FCMTokenManagement {
    private final FCMTokenRepository fcmTokenRepository;

    @Transactional
    public void saveToken(Long userId, String token) {
        try {
            fcmTokenRepository.save(new FCMToken(userId, token));
        } catch (DataIntegrityViolationException e) {
            log.debug(e.getMessage());
            throw new FCMException(FCMError.TOKEN_ENROLL_ERROR);
        }
    }

    @Transactional
    public void deleteToken(Long userId, String token) {
        try {
            fcmTokenRepository.deleteByUserIdAndToken(userId, token);
        } catch (DataIntegrityViolationException e) {
            log.debug(e.getMessage());
            throw new FCMException(FCMError.TOKEN_DELETE_FAIL);
        }
    }
}
