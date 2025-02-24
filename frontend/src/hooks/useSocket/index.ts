import {useContext} from "react";
import {SocketContext} from "@/pages/SocketLayout/layout.tsx";


export function useSocket() {
    return useContext(SocketContext);
}
