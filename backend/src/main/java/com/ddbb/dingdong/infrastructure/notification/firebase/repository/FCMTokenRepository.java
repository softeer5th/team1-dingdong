package com.ddbb.dingdong.infrastructure.notification.firebase.repository;

import com.ddbb.dingdong.infrastructure.notification.firebase.entity.FCMToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FCMTokenRepository extends JpaRepository<FCMToken, Long> {
    void deleteByUserIdAndToken(Long userId, String token);

    Optional<FCMToken> findByUserIdAndToken(Long userId, String oldToken);

    @Query("SELECT fcmToken FROM FCMToken fcmToken WHERE fcmToken.userId in :userIds AND fcmToken.isActive = true")
    List<FCMToken> findActiveTokens(@Param("userIds") List<Long> userIds);
}
