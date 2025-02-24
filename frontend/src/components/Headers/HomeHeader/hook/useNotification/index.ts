import {useEffect, useState} from "react";
import {useSocket} from "@/hooks/useSocket";


export function useNotification(initNotification: boolean) {
    const {ws} = useSocket()
    const [isNotification, setIsNotification] = useState<boolean>(initNotification)

    useEffect(() => {
        if (!(ws instanceof WebSocket)) return;

        const handleMessage = (message: MessageEvent) => {
            const data: string = message.data;
            if (data !== 'alarm') return
            setIsNotification(true);
        };

        ws.addEventListener("message", handleMessage)

        return () => ws.removeEventListener("message", handleMessage)
    }, [ws]);

    return isNotification
}