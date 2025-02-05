package com.ddbb.dingdong.infrastructure.webSocket.repository;

import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.AuthenticationManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class SocketRepository {
    private final Map<Long, WebSocketSession> storage = new ConcurrentHashMap<>();

    public WebSocketSession get(Long userId) {
        return storage.get(userId);
    }

    public WebSocketSession put(Long userId, WebSocketSession session) {
        return storage.put(userId, session);
    }

    /**
     * @param userId : 사용자 아이디
     * 입력으로 넣은 사용자 아이디와 연결된 소켓 connection을 컬렉션에서 제거합니다.
     * 반환된 WebSocketSession은 명시적으로 close 되어야 합니다.
     * **/
    public WebSocketSession remove(Long userId) throws IOException {
        return storage.remove(userId);
    }
}
