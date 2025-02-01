package com.ddbb.dingdong.infrastructure.auth.configuration;

import com.ddbb.dingdong.infrastructure.auth.annotation.LoginUserArgumentResolver;
import com.ddbb.dingdong.infrastructure.auth.filter.SessionInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final SessionInterceptor sessionInterceptor;
    private final LoginUserArgumentResolver loginUserArgumentResolver;

    public WebConfig(SessionInterceptor sessionInterceptor, LoginUserArgumentResolver loginUserArgumentResolver) {
        this.sessionInterceptor = sessionInterceptor;
        this.loginUserArgumentResolver = loginUserArgumentResolver;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/auth/login", "/api/auth/join");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginUserArgumentResolver);
    }
}
