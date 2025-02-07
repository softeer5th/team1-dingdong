package com.ddbb.dingdong.presentation.endpoint.user;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.user.GetUserInfoUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.ddbb.dingdong.application.usecase.user.GetUserInfoUseCase.Param;
import static com.ddbb.dingdong.application.usecase.user.GetUserInfoUseCase.Result;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final GetUserInfoUseCase getUserInfoUseCase;

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
}
