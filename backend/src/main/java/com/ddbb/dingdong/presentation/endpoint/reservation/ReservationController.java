package com.ddbb.dingdong.presentation.endpoint.reservation;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.reservation.GetReservationsUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.annotation.LoginUser;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.ReservationCategory;
import com.ddbb.dingdong.presentation.endpoint.reservation.exchanges.SortType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/reservations")
public class ReservationController {
    private final GetReservationsUseCase getReservationsUseCase;

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
}
