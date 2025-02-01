package com.ddbb.dingdong.infrastructure.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Objects;

@Component
public class AuthenticationManager {
    private static final String SESSION_ATTRIBUTE_NAME = "AUTH_USER";

    public void setAuthentication(AuthUser user) {
        HttpServletRequest request = getCurrentRequest();
        HttpSession session = Objects.requireNonNull(request).getSession();
        session.setAttribute(SESSION_ATTRIBUTE_NAME, user);
    }

    public AuthUser getAuthentication() {
        HttpServletRequest request = getCurrentRequest();
        HttpSession session = Objects.requireNonNull(request).getSession(false);
        if (session == null) return null;
        return (AuthUser) session.getAttribute(SESSION_ATTRIBUTE_NAME);
    }

    public void removeAuthentication() {
        HttpServletRequest request = getCurrentRequest();
        HttpSession session = Objects.requireNonNull(request).getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        return (attributes != null ? attributes.getRequest() : null);
    }
}