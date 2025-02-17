package com.ddbb.dingdong.presentation.endpoint.reservation;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.reservation.*;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.infrastructure.auth.security.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.security.annotation.LoginUser;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.*;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.enums.ReservationCategory;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.enums.SortType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/reservations")
public class ReservationController {
    private final GetReservationsUseCase getReservationsUseCase;
    private final RequestGeneralReservationUseCase requestGeneralReservationUseCase;
    private final RequestTogetherReservationUseCase requestTogetherReservationUseCase;
    private final MakeGeneralReservationUseCase makeGeneralReservationUseCase;
    private final MakeTogetherReservationUseCase makeTogetherReservationUseCase;
    private final CancelReservationUseCase cancelReservationUseCase;
    private final SuggestReservationUseCase suggestReservationUseCase;

    @GetMapping
    public ResponseEntity<GetReservationsUseCase.Result> getReservations(
            @LoginUser AuthUser user,
            @RequestParam SortType sort,
            @RequestParam ReservationCategory category,
            @RequestParam int page,
            @RequestParam(defaultValue = "-1") int pageSize
    ) {
        Pageable pageable = pageSize == -1 ? Pageable.unpaged() : PageRequest.of(page, pageSize);
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
    @GetMapping("/suggestions")
    public ResponseEntity<SuggestReservationUseCase.Result> getReservations(
        @LoginUser AuthUser user,
        @RequestParam Direction direction,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth
    ) {
        Long userId = user.id();
        SuggestReservationUseCase.Param param = new SuggestReservationUseCase.Param(
                userId,
                direction,
                yearMonth
        );
        SuggestReservationUseCase.Result result;
        try {
            result = suggestReservationUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> cancelReservation(
            @LoginUser AuthUser user,
            @PathVariable Long reservationId
    ) {
        Long userId = user.id();
        CancelReservationUseCase.Param param = new CancelReservationUseCase.Param(
                userId,
                reservationId
        );

        try {
            cancelReservationUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/token/general")
    public ResponseEntity<RequestGeneralReservationUseCase.Result> getReservations(
            @LoginUser AuthUser user,
            @RequestBody GeneralReservationRequestDTO generalReservationRequestDTO
    ) {
        Long userId = user.id();
        RequestGeneralReservationUseCase.Param param = new RequestGeneralReservationUseCase.Param(
                userId,
                generalReservationRequestDTO.getDirection(),
                generalReservationRequestDTO.getDates().stream().map(
                        reservationInfo -> new RequestGeneralReservationUseCase.Param.ReservationInfo(
                                reservationInfo.getDate()
                        )
                ).toList()
        );
        RequestGeneralReservationUseCase.Result result;
        try {
            result = requestGeneralReservationUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/token/together")
    public ResponseEntity<RequestTogetherReservationUseCase.Result> getReservations(
            @LoginUser AuthUser user,
            @RequestBody TogetherReservationRequestDTO togetherReservationRequestDTO
    ) {
        Long userId = user.id();
        RequestTogetherReservationUseCase.Param param = new RequestTogetherReservationUseCase.Param(
                userId,
                togetherReservationRequestDTO.getBusStopId(),
                togetherReservationRequestDTO.getBusScheduleId()
        );
        RequestTogetherReservationUseCase.Result result;
        try {
            result = requestTogetherReservationUseCase.execute(param);
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
                                reservationInfo -> new MakeGeneralReservationUseCase.Param.ReservationInfo.ReservationDate(
                                        reservationInfo.getDate()
                                )
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

    @PostMapping("/together")
    public ResponseEntity<Void> makeTogetherReservation(
            @LoginUser AuthUser user,
            @RequestBody TogetherReservationConfirmDTO togetherReservationConfirmDTO
    ) {
        Long userId = user.id();
        MakeTogetherReservationUseCase.Param param = new MakeTogetherReservationUseCase.Param(
                togetherReservationConfirmDTO.getToken(),
                new MakeTogetherReservationUseCase.Param.ReservationInfo(
                        userId,
                        togetherReservationConfirmDTO.getBusStopId(),
                        togetherReservationConfirmDTO.getBusScheduleId()
                )
        );
        try {
            makeTogetherReservationUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().build();
    }
}
