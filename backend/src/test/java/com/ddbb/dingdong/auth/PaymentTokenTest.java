package com.ddbb.dingdong.auth;

import com.ddbb.dingdong.application.usecase.reservation.RequestReservationUseCase;
import com.ddbb.dingdong.infrastructure.auth.encrypt.TokenManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
public class PaymentTokenTest {
    @Autowired
    private TokenManager tokenManager;

    @Test
    @DisplayName("결제 정보가 유효한지 확인")
    public void testPaymentTokenIsValid() throws JsonProcessingException {
        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(
                1L,
                "TO_SCHOOL",
                List.of(new RequestReservationUseCase.Param.ReservationInfo(
                        LocalDateTime.now()
                ))
        );
        RequestReservationUseCase.Param param2 = new RequestReservationUseCase.Param(
                1L,
                "TO_SCHOOL",
                List.of(new RequestReservationUseCase.Param.ReservationInfo(
                        LocalDateTime.now().plusHours(1)
                ))
        );
        ObjectMapper objectMapper = new ObjectMapper();

        String data = objectMapper.writeValueAsString(param);
        String differentData = objectMapper.writeValueAsString(param2);

        String token = tokenManager.generateToken(data);

        Assertions.assertThat(token).isNotNull();
        Assertions.assertThat(tokenManager.validateToken(token,data)).isTrue();
        Assertions.assertThat(tokenManager.validateToken(token,data)).isTrue();
        Assertions.assertThat(tokenManager.validateToken(token,differentData)).isFalse();
    }
}
