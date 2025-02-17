package com.ddbb.dingdong.presentation.endpoint.user;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.user.EnrollFCMTokenUseCase;
import com.ddbb.dingdong.application.usecase.user.GetUserInfoUseCase;
import com.ddbb.dingdong.application.usecase.user.GetWalletBalanceUseCase;
import com.ddbb.dingdong.application.usecase.user.GetWalletHistoryUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.auth.security.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.security.annotation.LoginUser;
import com.ddbb.dingdong.presentation.endpoint.user.exchanges.EnrollFCMTokenRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final GetUserInfoUseCase getUserInfoUseCase;
    private final GetWalletBalanceUseCase getWalletBalanceUseCase;
    private final GetWalletHistoryUseCase getWalletHistoryUseCase;
    private final EnrollFCMTokenUseCase enrollFCMTokenUseCase;

    @GetMapping("/me")
    public GetUserInfoUseCase.Result getUserInfo(
            @LoginUser AuthUser authUser
    ) {
        try {
            return getUserInfoUseCase.execute(new GetUserInfoUseCase.Param(authUser.id()));
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/fcm-token")
    public ResponseEntity<Void> fcmToken(
            @LoginUser AuthUser authUser,
            @RequestBody EnrollFCMTokenRequest request
    ) {
        try {
            EnrollFCMTokenUseCase.Param param = new EnrollFCMTokenUseCase.Param(authUser.id(), request.getToken());
            enrollFCMTokenUseCase.execute(param);
            return ResponseEntity.ok().build();
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
}
