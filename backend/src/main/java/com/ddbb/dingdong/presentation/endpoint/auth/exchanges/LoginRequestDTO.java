package com.ddbb.dingdong.presentation.endpoint.auth.exchanges;

import lombok.Getter;

@Getter
public class LoginRequestDTO {
    private String email;
    private String password;
}