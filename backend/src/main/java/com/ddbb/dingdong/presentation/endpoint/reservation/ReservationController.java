package com.ddbb.dingdong.presentation.endpoint.reservation;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.reservation.GetReservationsUseCase;
import com.ddbb.dingdong.application.usecase.reservation.MakeGeneralReservationUseCase;
import com.ddbb.dingdong.application.usecase.reservation.RequestReservationUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.annotation.LoginUser;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.GeneralReservationConfirmDTO;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.ReservationCategory;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.ReservationRequestDTO;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.SortType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/reservations")
public class ReservationController {
    private final GetReservationsUseCase getReservationsUseCase;
    private final RequestReservationUseCase requestReservationUseCase;
    private final MakeGeneralReservationUseCase makeGeneralReservationUseCase;

    @GetMapping
    public ResponseEntity<GetReservationsUseCase.Result> getReservations(
            @LoginUser AuthUser user,
            @RequestParam SortType sort,
            @RequestParam ReservationCategory category,
            @RequestParam int page,
            @RequestParam int pageSize
    ) {
        Pageable pageable = PageRequest.of(page, pageSize);
        Long userId = user.id();
        GetReservationsUseCase.Param param= new GetReservationsUseCase.Param(userId, pageable, sort, category);
        GetReservationsUseCase.Result result;
        try {
            result = getReservationsUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/token")
    public ResponseEntity<RequestReservationUseCase.Result> getReservations(
            @LoginUser AuthUser user,
            @RequestBody ReservationRequestDTO reservationRequestDTO
    ) {
        Long userId = user.id();
        RequestReservationUseCase.Param param = new RequestReservationUseCase.Param(
                userId,
                reservationRequestDTO.getDirection(),
                reservationRequestDTO.getDates().stream().map(
                        reservationInfo -> new RequestReservationUseCase.Param.ReservationInfo(reservationInfo.getDate())
                ).toList()
        );
        RequestReservationUseCase.Result result;
        try {
            result = requestReservationUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/general")
    public ResponseEntity<Void> makeGeneralReservation(
            @LoginUser AuthUser user,
            @RequestBody GeneralReservationConfirmDTO generalReservationConfirmDTO
    ) {
        Long userId = user.id();
        MakeGeneralReservationUseCase.Param param = new MakeGeneralReservationUseCase.Param(
                generalReservationConfirmDTO.getToken(),
                new MakeGeneralReservationUseCase.Param.ReservationInfo(
                        userId,
                        generalReservationConfirmDTO.getDirection(),
                        generalReservationConfirmDTO.getDates().stream().map(
                                reservationInfo -> new MakeGeneralReservationUseCase.Param.ReservationInfo.ReservationDate(reservationInfo.getDate())
                        ).toList()
                )
        );
        try {
            makeGeneralReservationUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().build();
    }
}
