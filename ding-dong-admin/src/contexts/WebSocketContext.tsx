import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
  webSocket: WebSocket | null;
  connect: (onConnected?: () => void) => void;
  disconnect: (onDisconnected?: () => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  webSocket: null,
  connect: () => {},
  disconnect: () => {},
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async (onConnected?: () => void) => {
    if (isConnecting || webSocket?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    try {
      const ws = new WebSocket('ws://localhost:5173/ws');
      
      ws.onopen = () => {
        console.log('웹소켓 연결 성공');
        setWebSocket(ws);
        setIsConnecting(false);
        if (onConnected) {
          onConnected();
        }
      };
      
      ws.onclose = () => {
        console.log('웹소켓 연결 종료');
        setWebSocket(null);
        setIsConnecting(false);
      };
      
      ws.onerror = (error) => {
        console.error('웹소켓 오류:', error);
        setWebSocket(null);
        setIsConnecting(false);
      };
    } catch (error) {
      setIsConnecting(false);
    }
  };

  const disconnect = (onDisconnected?: () => void) => {
    if (webSocket) {
      webSocket.onclose = () => {
        console.log('웹소켓 연결 종료');
        setWebSocket(null);
        setIsConnecting(false);
        if (onDisconnected) {
          onDisconnected();
        }
      };
      webSocket.close();
    }
  };

  // 자동 재연결 시도
  useEffect(() => {
    if (!webSocket && !isConnecting) {
      const reconnectTimeout = setTimeout(() => {
        connect();
      }, 5000); // 5초 후 재연결 시도

      return () => clearTimeout(reconnectTimeout);
    }
  }, [webSocket, isConnecting]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ webSocket, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext); 