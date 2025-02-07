package com.ddbb.dingdong.presentation.endpoint.auth;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.user.LoginUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.presentation.endpoint.auth.exchanges.LoginRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final LoginUseCase loginUseCase;

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @RequestBody LoginRequestDTO loginRequestDTO
    ) {
        LoginUseCase.Param param = new LoginUseCase.Param(loginRequestDTO.getEmail(), loginRequestDTO.getPassword());
        try {
            loginUseCase.execute(param);
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok().build();
    }
}
