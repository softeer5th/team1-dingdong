import { useEffect, useState } from "react";

let socket: WebSocket | null = null;
let shouldReconnect = true; // 수동 종료 여부를 확인하는 플래그

export function useSocket() {
    const [ws, setWs] = useState<WebSocket | null>(socket);

    useEffect(() => {
        if (!socket) {
            connectWebSocket(setWs);
        }

        return () => {
            console.log("🛑 SPA 유지 중이므로 웹소켓을 닫지 않음");
        };
    }, []);

    return ws;
}

// 웹소켓 연결 함수 (전역에서 관리)
function connectWebSocket(setWs: (ws: WebSocket | null) => void) {
    console.log("✅ 웹소켓 연결 시도...");
    socket = new WebSocket("ws://localhost:5173/ws");

    socket.onopen = () => {
        console.log("🔗 웹소켓 연결됨");
        setWs(socket);
    };

    socket.onclose = (event) => {
        console.log("❌ 웹소켓 연결 종료됨", event);
        socket = null;

        if (shouldReconnect) {
            reconnect(setWs); // 🔄 자동 재연결
        } else {
            console.log("🛑 수동 종료됨: 재연결하지 않음");
        }
    };

    socket.onerror = (error) => console.error("⚠️ 웹소켓 오류:", error);
}

// 웹소켓이 종료되었을 때 자동 재연결 (5초 후)
function reconnect(setWs: (ws: WebSocket | null) => void) {
    setTimeout(() => {
        if (!socket && shouldReconnect) {
            console.log("♻️ 웹소켓 재연결 시도...");
            connectWebSocket(setWs);
        }
    }, 5000); // 5초 후 재연결 시도
}

// 수동으로 웹소켓 종료하는 함수 (재연결 방지)
export function closeSocket() {
    shouldReconnect = false;
    if (socket) {
        console.log("🔌 웹소켓 수동 종료");
        socket.close();
        socket = null;
    }
}
