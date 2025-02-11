package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.usecase.reservation.error.ReservationInvalidParamErrors;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.infrastructure.auth.encrypt.TokenManager;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestReservationUseCase implements UseCase<RequestReservationUseCase.Param, RequestReservationUseCase.Result> {
    private final TokenManager tokenManager;

    @Override
    public Result execute(Param param) {
        param.validate();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String data = objectMapper.writeValueAsString(param);
            String encryptedReservationInfo = tokenManager.generateToken(data);
            return new Result(encryptedReservationInfo);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long userId;
        private String direction;
        private List<ReservationInfo> reservationDates;

        @Getter
        @AllArgsConstructor
        public static class ReservationInfo {
            @JsonSerialize(using = LocalDateTimeSerializer.class)
            @JsonDeserialize(using = LocalDateTimeDeserializer.class)
            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
            private LocalDateTime date;
        }

        @Override
        public boolean validate() {
            if(!validateDirection(direction)) throw ReservationInvalidParamErrors.INVALID_DIRECTION.toException();
            if(!validateReservationsDate(reservationDates)) throw ReservationInvalidParamErrors.INVALID_DATE.toException();

            return true;
        }

        private static boolean validateDirection(String direction) {
            try {
                Direction.valueOf(direction);
            } catch (Exception e) {
                return false;
            }

            return true;
        }

        private static boolean validateReservationsDate(List<ReservationInfo> reservations) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime minDate = now.plusHours(48);
            LocalDateTime maxDate = now.plusMonths(2);

            return reservations.stream().anyMatch(
                    reservationInfo -> {
                        if(reservationInfo.date.isBefore(minDate) || reservationInfo.date.isAfter(maxDate)) {
                            return false;
                        }
                        if(reservationInfo.date.getMinute() != 0 && reservationInfo.date.getMinute() != 30) {
                            return false;
                        }

                        return true;
                    }
            );
        }


    }

    @Getter
    @AllArgsConstructor
    public static class Result {
        private String token;
    }

}
