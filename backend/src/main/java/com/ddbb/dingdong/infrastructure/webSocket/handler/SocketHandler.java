package com.ddbb.dingdong.infrastructure.webSocket.handler;

import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.webSocket.CustomCloseStatus;
import com.ddbb.dingdong.infrastructure.webSocket.repository.SocketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {
    final static String SESSION_NAME = "user";
    private final SocketRepository socketRepository;

    /**
     * SocketRepository에 유저 하나당 하나의 WebSocketSession만 유지하도록
     * 새롭게 웹 소켓이 연결이 되면, 기존 WebSocketSession을 새 WebSocketSession으로 대체하고,
     * 기존 WebSocketSession을 close 함.
     * **/
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        WebSocketSession concurrentSocket = new ConcurrentWebSocketSessionDecorator(session, 1000, 1024);
        AuthUser authUser = (AuthUser)session.getAttributes().get(SESSION_NAME);

        WebSocketSession webSocketSession = socketRepository.put(authUser.id(),  concurrentSocket);
        if (webSocketSession != null) {
            webSocketSession.close(CustomCloseStatus.DUPLICATE_WEBSOCKET);
        }
        log.debug("user({}) connected is established", authUser.id());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        AuthUser authUser = (AuthUser)session.getAttributes().get(SESSION_NAME);

        log.debug("user({}) disconnected", authUser.id());
        if (closeStatus != CustomCloseStatus.DUPLICATE_WEBSOCKET) {
            socketRepository.remove(authUser.id());
        }
    }
}
