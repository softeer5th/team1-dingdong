package com.ddbb.dingdong.infrastructure.configuration;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.ddbb.dingdong.infrastructure.auth.security.annotation.LoginUserArgumentResolver;
import com.ddbb.dingdong.infrastructure.auth.security.filter.SessionInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${client.ip}")
    private String CLIENT_ADDRESS;
    @Value("${client.port}")
    private String CLIENT_PORT;
    @Value("${client.schema}")
    private String CLIENT_SCHEMA;

    private final SessionInterceptor sessionInterceptor;
    private final LoginUserArgumentResolver loginUserArgumentResolver;

    public WebConfig(SessionInterceptor sessionInterceptor, LoginUserArgumentResolver loginUserArgumentResolver) {
        this.sessionInterceptor = sessionInterceptor;
        this.loginUserArgumentResolver = loginUserArgumentResolver;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/**");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginUserArgumentResolver);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                .allowedOriginPatterns(
                        "http://localhost:5173",
                        String.format("%s://%s%s",CLIENT_SCHEMA, CLIENT_ADDRESS, CLIENT_PORT)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Cookie", "credentials", "Content-Type")
                .exposedHeaders("Set-Cookie")
                .allowCredentials(true)
                .maxAge(3600); // 1시간 동안 pre-flight 요청 결과를 캐시
    }
}
