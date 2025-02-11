package com.ddbb.dingdong.application.usecase.reservation;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.domain.clustering.entity.Location;
import com.ddbb.dingdong.domain.clustering.service.ClusteringService;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.payment.service.PaymentManagement;
import com.ddbb.dingdong.domain.reservation.entity.Reservation;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationStatus;
import com.ddbb.dingdong.domain.reservation.entity.vo.ReservationType;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import com.ddbb.dingdong.domain.user.entity.Home;
import com.ddbb.dingdong.domain.user.service.UserManagement;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MakeGeneralReservationUseCase implements UseCase<MakeGeneralReservationUseCase.Param, Void> {
    private final ReservationManagement reservationManagement;
    private final PaymentManagement paymentManagement;
    private final TokenManager tokenManager;
    private final UserManagement userManagement;
    private final ClusteringService clusteringService;

    @Transactional
    @Override
    public Void execute(Param param) {
        validateToken(param.token, param.reservationInfo);
        makeGeneralReservations(param.reservationInfo);
        pay(param.getReservationInfo().userId, param.getReservationInfo().getReservationDates().size());
        return null;
    }

    private void validateToken(String token, Param.ReservationInfo reservation) {
        String data;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            data = objectMapper.writeValueAsString(reservation);
            tokenManager.validateToken(token, data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.UNAUTHORIZED);
        }
    }

    private void makeGeneralReservations(Param.ReservationInfo reservationInfo) {
        Home home = userManagement.load(reservationInfo.userId).getHome();

        for(Param.ReservationInfo.ReservationDate date : reservationInfo.reservationDates) {
            Reservation reservation = new Reservation();
            reservation.setUserId(reservationInfo.getUserId());
            reservation.setType(ReservationType.GENERAL);
            reservation.setDirection(Direction.valueOf(reservationInfo.getDirection()));
            reservation.setStatus(ReservationStatus.PENDING);
            reservation.setStartDate(date.date.toLocalDate());
            if(reservation.getDirection().equals(Direction.TO_SCHOOL)) {
                reservation.setArrivalTime(date.date);
            }else {
                reservation.setDepartureTime(date.date);
            }
            Location location = new Location();
            Long reservationId = reservationManagement.reserve(reservation).getId();
            location.setReservationId(reservationId);
            location.setLatitude(home.getStationLatitude());
            location.setLongitude(home.getStationLongitude());
            clusteringService.saveLocation(location);
        }
    }

    private void pay(Long userId , int quantity){
        paymentManagement.pay(userId, quantity);
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private String token;
        private ReservationInfo reservationInfo;

        @Getter
        @AllArgsConstructor
        public static class ReservationInfo {
            private Long userId;
            private String direction;
            private List<ReservationDate> reservationDates;

            @Getter
            @AllArgsConstructor
            public static class ReservationDate {
                @JsonSerialize(using = LocalDateTimeSerializer.class)
                @JsonDeserialize(using = LocalDateTimeDeserializer.class)
                @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
                private LocalDateTime date;
            }
        }
    }
}
