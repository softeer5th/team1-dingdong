package com.ddbb.dingdong.infrastructure.firebase.repository;

import com.ddbb.dingdong.infrastructure.firebase.entity.FCMToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FCMTokenRepository extends JpaRepository<FCMToken, Long> {
    void deleteByUserIdAndToken(Long userId, String token);

    Optional<FCMToken> findByUserIdAndToken(Long userId, String oldToken);
}
