package com.ddbb.dingdong.auth;

import com.ddbb.dingdong.application.usecase.reservation.RequestGeneralReservationUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.infrastructure.auth.encrypt.token.CachedTokenProvider;
import com.ddbb.dingdong.infrastructure.auth.encrypt.token.TokenManager;
import com.ddbb.dingdong.infrastructure.auth.encrypt.utils.AESEncoder;
import com.ddbb.dingdong.infrastructure.auth.encrypt.utils.SHA512Encoder;
import com.ddbb.dingdong.infrastructure.cache.SimpleCache;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

public class PaymentTokenTest {
    private TokenManager tokenManager = new TokenManager(new SHA512Encoder(), new AESEncoder(), new CachedTokenProvider(new SimpleCache()));

    @Test
    @DisplayName("결제 정보가 유효한지 확인")
    public void testPaymentTokenIsValid() {
        RequestGeneralReservationUseCase.Param param = new RequestGeneralReservationUseCase.Param(
                1L,
                Direction.TO_SCHOOL,
                List.of(new RequestGeneralReservationUseCase.Param.ReservationInfo(
                        LocalDateTime.now()
                ))
        );
        RequestGeneralReservationUseCase.Param differentParam = new RequestGeneralReservationUseCase.Param(
                1L,
                Direction.TO_SCHOOL,
                List.of(new RequestGeneralReservationUseCase.Param.ReservationInfo(
                        LocalDateTime.now().plusHours(1)
                ))
        );

        String token = tokenManager.generateToken(param);

        Assertions.assertThat(token).isNotNull();
        Assertions.assertThat(tokenManager.validateToken(token,param)).isTrue();
        Assertions.assertThatThrownBy(() -> tokenManager.validateToken(token, differentParam))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("[INCORRECT_SIGNATURE]");
    }
}
