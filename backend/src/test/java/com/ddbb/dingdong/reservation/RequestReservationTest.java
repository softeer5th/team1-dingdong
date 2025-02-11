package com.ddbb.dingdong.reservation;

import com.ddbb.dingdong.application.usecase.reservation.RequestReservationUseCase;
import com.ddbb.dingdong.application.usecase.reservation.error.ReservationInvalidParamErrors;
import com.ddbb.dingdong.infrastructure.auth.encrypt.TokenManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequestReservationUseCaseTest {

    @Mock
    private TokenManager tokenManager;

    @InjectMocks
    private RequestReservationUseCase requestReservationUseCase;

    @Test
    @DisplayName("정상적인 결제 요청이 들어왔을 때, 토큰이 정상적으로 생성되는지 확인")
    void execute_ValidParam_GeneratesToken() {
        // Given
        Long userId = 1L;
        String direction = "TO_SCHOOL";
        LocalDateTime validDate = LocalDateTime.now().plusDays(3).withMinute(0); // 48시간 이후
        List<RequestReservationUseCase.Param.ReservationInfo> reservationInfos = List.of(new RequestReservationUseCase.Param.ReservationInfo(validDate));
        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(userId, direction, reservationInfos);

        String expectedToken = "encryptedToken123";

        when(tokenManager.generateToken(anyString())).thenReturn(expectedToken);

        // When
        RequestReservationUseCase.Result result = requestReservationUseCase.execute(param);

        // Then
        assertNotNull(result);
        assertEquals(expectedToken, result.getToken()); // 생성된 토큰이 올바른지 확인
        verify(tokenManager, times(1)).generateToken(anyString()); // TokenManager가 호출되었는지 확인
    }


    @Test
    @DisplayName("잘못된 방향(`direction`)이 주어졌을 때, 예외 발생 확인")
    void validate_InvalidDirection_ThrowsException() {
        // Given
        Long userId = 1L;
        String invalidDirection = "INVALID";
        LocalDateTime validDate = LocalDateTime.now().plusDays(3).withMinute(0);
        List<RequestReservationUseCase.Param.ReservationInfo> reservationInfos = List.of(new RequestReservationUseCase.Param.ReservationInfo(validDate));

        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(userId, invalidDirection, reservationInfos);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, param::validate);
        assertEquals(ReservationInvalidParamErrors.INVALID_DIRECTION.toException().getMessage(), exception.getMessage());
    }

    @Test
    @DisplayName("48시간 이전 날짜가 포함된 경우 예외 발생")
    void validate_InvalidReservationDate_Before48Hours_ThrowsException() {
        // Given
        Long userId = 1L;
        String direction = "TO_SCHOOL";
        LocalDateTime invalidDate = LocalDateTime.now().plusHours(24); // 48시간 이전
        List<RequestReservationUseCase.Param.ReservationInfo> reservationInfos = List.of(new RequestReservationUseCase.Param.ReservationInfo(invalidDate));

        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(userId, direction, reservationInfos);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, param::validate);
        assertEquals(ReservationInvalidParamErrors.INVALID_DATE.toException().getMessage(), exception.getMessage());
    }

    @Test
    @DisplayName("2개월 이후 날짜가 포함된 경우 예외 발생")
    void validate_InvalidReservationDate_AfterTwoMonths_ThrowsException() {
        // Given
        Long userId = 1L;
        String direction = "TO_SCHOOL";
        LocalDateTime invalidDate = LocalDateTime.now().plusMonths(3); // 2개월 이후
        List<RequestReservationUseCase.Param.ReservationInfo> reservationInfos = List.of(new RequestReservationUseCase.Param.ReservationInfo(invalidDate));

        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(userId, direction, reservationInfos);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, param::validate);
        assertEquals(ReservationInvalidParamErrors.INVALID_DATE.toException().getMessage(), exception.getMessage());
    }

    @Test
    @DisplayName("예약 시간에서 분이 0 또는 30이 아닌 경우 예외 발생")
    void validate_InvalidMinute_ThrowsException() {
        // Given
        Long userId = 1L;
        String direction = "TO_SCHOOL";
        LocalDateTime invalidDate = LocalDateTime.now().plusDays(3).withMinute(15); // 15분
        List<RequestReservationUseCase.Param.ReservationInfo> reservationInfos = List.of(new RequestReservationUseCase.Param.ReservationInfo(invalidDate));

        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(userId, direction, reservationInfos);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, param::validate);
        assertEquals(ReservationInvalidParamErrors.INVALID_DATE.toException().getMessage(), exception.getMessage());
    }
}