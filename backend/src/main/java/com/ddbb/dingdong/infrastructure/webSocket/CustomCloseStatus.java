package com.ddbb.dingdong.infrastructure.webSocket;

import org.springframework.web.socket.CloseStatus;

public class CustomCloseStatus {
    public static final CloseStatus DUPLICATE_WEBSOCKET = new CloseStatus(4000, "Duplicate websocket");
}
