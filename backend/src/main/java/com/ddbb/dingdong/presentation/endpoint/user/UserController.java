package com.ddbb.dingdong.presentation.endpoint.user;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.user.*;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.auth.security.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.security.annotation.LoginUser;
import com.ddbb.dingdong.presentation.endpoint.user.exchanges.ChangeTimetableDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.ddbb.dingdong.application.usecase.user.GetUserInfoUseCase.Param;
import static com.ddbb.dingdong.application.usecase.user.GetUserInfoUseCase.Result;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final GetUserInfoUseCase getUserInfoUseCase;
    private final GetWalletBalanceUseCase getWalletBalanceUseCase;
    private final GetWalletHistoryUseCase getWalletHistoryUseCase;
    private final GetTimetableUseCase getTimetableUseCase;
    private final ChangeTimetableUseCase changeTimetableUseCase;

    @GetMapping("/me")
    public Result getUserInfo(
            @LoginUser AuthUser authUser
    ) {
        try {
            return getUserInfoUseCase.execute(new Param(authUser.id()));
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/wallet/balance")
    public ResponseEntity<GetWalletBalanceUseCase.Response> getWalletBalance(
            @LoginUser AuthUser authUser
    ) {
        try {
            GetWalletBalanceUseCase.Param param = new GetWalletBalanceUseCase.Param(authUser.id());
            GetWalletBalanceUseCase.Response result = getWalletBalanceUseCase.execute(param);
            return ResponseEntity.ok(result);
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/wallet/history")
    public ResponseEntity<GetWalletHistoryUseCase.Result> getWalletHistory(
            @LoginUser AuthUser authUser,
            @RequestParam("page") int page,
            @RequestParam(value = "pageSize",defaultValue = "-1") int pageSize
    ) {
        Pageable pageable = pageSize == -1 ? Pageable.unpaged() : PageRequest.of(page, pageSize);
        Long userId = authUser.id();
        GetWalletHistoryUseCase.Param param = new GetWalletHistoryUseCase.Param(userId, pageable);
        GetWalletHistoryUseCase.Result result = getWalletHistoryUseCase.execute(param);

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/timetable")
    public ResponseEntity<GetTimetableUseCase.Result> getTimetable(
            @LoginUser AuthUser authUser
    ) {
        Long userId = authUser.id();
        GetTimetableUseCase.Param param = new GetTimetableUseCase.Param(userId);
        GetTimetableUseCase.Result result;
        try {
            result = getTimetableUseCase.execute(param);
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/timetable")
    public ResponseEntity<Void> putTimetable(
            @LoginUser AuthUser authUser,
            @RequestBody ChangeTimetableDto changeTimetableDto
    ) {
        Long userId = authUser.id();
        ChangeTimetableUseCase.Param param = new ChangeTimetableUseCase.Param(
                userId,
                changeTimetableDto.getMonStartTime(),
                changeTimetableDto.getMonEndTime(),
                changeTimetableDto.getTueStartTime(),
                changeTimetableDto.getTueEndTime(),
                changeTimetableDto.getWedStartTime(),
                changeTimetableDto.getWedEndTime(),
                changeTimetableDto.getThuStartTime(),
                changeTimetableDto.getThuEndTime(),
                changeTimetableDto.getFriStartTime(),
                changeTimetableDto.getFriEndTime()
        );
        try {
            changeTimetableUseCase.execute(param);
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().build();
    }
}
