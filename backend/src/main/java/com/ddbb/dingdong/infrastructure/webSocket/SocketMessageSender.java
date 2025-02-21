package com.ddbb.dingdong.infrastructure.webSocket;

import com.ddbb.dingdong.infrastructure.webSocket.repository.SocketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class SocketMessageSender {
    private final SocketRepository socketRepository;

    public boolean sendMessage(Long userId, String message) {
        try {
            WebSocketSession webSocketSession = socketRepository.get(userId);
            if (webSocketSession != null && webSocketSession.isOpen()) {
                webSocketSession.sendMessage(new TextMessage(message));
            }
            return true;
        } catch (IOException e) {
            log.info(e.getMessage());
            return false;
        }
    }

    public boolean sendMessage(Long userId, String message, int retry) {
        for (int i = 0; i < retry; i++) {
            if (sendMessage(userId, message)) {
                return true;
            }
        }
        return false;
    }
}
