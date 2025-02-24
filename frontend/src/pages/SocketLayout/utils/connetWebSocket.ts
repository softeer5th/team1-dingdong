export function connectWebSocket(setWs: (ws: WebSocket | null) => void) {
    console.log("✅ 웹소켓 연결 시도...");
    const socket = new WebSocket(import.meta.env.VITE_WS_BASE_URL);

    socket.onopen = () => {
        console.log("🔗 웹소켓 연결됨");
        setWs(socket);
        socket.binaryType = 'arraybuffer';
    };

    socket.onclose = (event) => {
        console.log("❌ 웹소켓 연결 종료됨", event);
        reconnect(setWs); // 🔄 자동 재연결
    };

    socket.onerror = (error) => console.error("⚠️ 웹소켓 오류:", error);
}

// 웹소켓이 종료되었을 때 자동 재연결 (5초 후)
function reconnect(setWs: (ws: WebSocket | null) => void) {
    setTimeout(() => {
        console.log("♻️ 웹소켓 재연결 시도...");
        connectWebSocket(setWs);
    }, 5000); // 5초 후 재연결 시도
}