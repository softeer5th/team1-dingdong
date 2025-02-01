package com.ddbb.dingdong.auth;

import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.AuthenticationManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationManagerTest {
    private AuthenticationManager authenticationManager;
    private HttpServletRequest mockRequest;
    private HttpSession mockSession;

    @BeforeEach
    void setUp() {
        authenticationManager = new AuthenticationManager();
        mockRequest = mock(HttpServletRequest.class);
        mockSession = mock(HttpSession.class);

        ServletRequestAttributes attributes = new ServletRequestAttributes(mockRequest);
        RequestContextHolder.setRequestAttributes(attributes);

        when(mockRequest.getSession()).thenReturn(mockSession);
        when(mockRequest.getSession(false)).thenReturn(mockSession);
    }

    @Test
    @DisplayName("로그인 시 세션에 AuthUser 저장 되었는지 테스트")
    void testSetAuthenticationAndGetAuthentication() {
        AuthUser user = new AuthUser(1L);

        authenticationManager.setAuthentication(user);

        verify(mockSession).setAttribute("AUTH_USER", user);
        when(mockSession.getAttribute("AUTH_USER")).thenReturn(user);
        AuthUser retrievedUser = authenticationManager.getAuthentication();

        assertNotNull(retrievedUser);
        assertEquals(user.id(), retrievedUser.id());
    }

    @Test
    @DisplayName("로그아웃시 세션이 무효화 되었는지 테스트")
    void testRemoveAuthentication() {
        AuthUser user = new AuthUser(1L);
        authenticationManager.setAuthentication(user);

        authenticationManager.removeAuthentication();

        verify(mockSession).invalidate();
        when(mockSession.getAttribute("AUTH_USER")).thenReturn(null);
        assertNull(authenticationManager.getAuthentication());
    }
}