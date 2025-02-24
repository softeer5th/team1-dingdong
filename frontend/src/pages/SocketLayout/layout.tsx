import {Outlet, useRevalidator} from "react-router-dom";
import {createContext, useEffect, useState} from "react";
import useToast from "@/hooks/useToast";
import {connectWebSocket} from "@/pages/SocketLayout/utils/connetWebSocket.ts";
import {handleMessage} from "@/pages/SocketLayout/utils/handleMessage.ts";


interface SocketContextType {
    ws: WebSocket | null;
}

export const SocketContext = createContext<SocketContextType>({
    ws: null,
});

export default function Layout() {
    const addToast = useToast()
    const [ws, setWs] = useState<WebSocket | null>(null);
    const {revalidate} = useRevalidator()

    useEffect(() => {
        if (!ws) {
            connectWebSocket(setWs);
        }

        return () => {
            console.log("🛑 SPA 유지 중이므로 웹소켓을 닫지 않음");
        };
    }, []);


    useEffect(() => {
        if (!(ws instanceof WebSocket)) return;

        const messageEvent = (msg: MessageEvent<any>) => {
            handleMessage(msg, addToast, revalidate)
        }

        ws.addEventListener("message", messageEvent)

        return () => {
            ws.removeEventListener("message", messageEvent)
        }
    }, [ws]);


    return (
        <SocketContext.Provider value={{ ws }}>
            <Outlet />
        </SocketContext.Provider>
    )
}

