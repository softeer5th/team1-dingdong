package com.ddbb.dingdong.infrastructure.auth.security;

import com.ddbb.dingdong.domain.user.entity.vo.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
public class SecurityConfig {
    private static final List<String> IGNORE_URLS = Arrays.asList(
            "/api/auth/login",
            "/api/auth/signup",
            "/api/auth/check-email",
            "/api/school",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/actuator/**"
    );

    @Bean
    public Map<String, Set<Role>> roleMapping() {
        return new SecurityRegistry()
                .antMatchers(IGNORE_URLS).permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .build();
    }

}
