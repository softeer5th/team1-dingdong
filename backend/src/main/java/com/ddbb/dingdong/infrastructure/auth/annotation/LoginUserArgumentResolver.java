package com.ddbb.dingdong.infrastructure.auth.annotation;

import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.AuthenticationManager;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver {
    private final AuthenticationManager authenticationManager;

    public LoginUserArgumentResolver(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(LoginUser.class) != null &&
                parameter.getParameterType().equals(AuthUser.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        return authenticationManager.getAuthentication();
    }
}
