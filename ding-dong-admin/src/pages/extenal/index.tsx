import {BusWrapper} from "@/pages/BusTracker/components/BusOverlay/styles.ts";
import {CustomOverlayMap} from "react-kakao-maps-sdk";
import {PositionType} from "@/pages/BusTracker/page.tsx";
import BusIcon from "@/components/designSystem/Icons/BusTracker/BusIcon.tsx";
import {useEffect, useState} from "react";
import {axiosInstance} from "@/api";
import {useSocket} from "@/hooks/useSocket";
import {useSearchParams} from "react-router-dom";

export default function BusOverlay() {
    const [busLocation, setBusLocation] = useState<PositionType>({
        lat: 0,
        lng: 0
    })
    const ws = useSocket()
    const [searchParams] = useSearchParams();
    const busScheduleId = searchParams.get("busScheduleId");


    useEffect(() => {
        if (ws instanceof WebSocket && busScheduleId != null) {
            // 메시지 처리
            const handleMessage = (message: MessageEvent) => {
                const data = JSON.parse(message.data);
                setBusLocation({
                    lat: data.latitude,
                    lng: data.longitude,
                })
                console.log("버스 정보", data);
            };

            // 메시지 처리 함수 등록
            ws.addEventListener("message", handleMessage);

            console.log("구독 시작", ws)
            axiosInstance.post(`/api/bus/subscription/${busScheduleId}`)
                .then(() => console.log("성공"))
                .catch((error) => console.log("실패", error))
                .finally(() => console.log("????"))

            return () => {
                axiosInstance.delete(`/api/bus/subscription/${busScheduleId}`)
                    .then(() => console.log("성공"))
                ws.removeEventListener("message", handleMessage); // 언마운트 시 이벤트 리스너 삭제
            };
        }
    }, [ws, busScheduleId]);



    return (
        <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
            // 커스텀 오버레이가 표시될 위치입니다
            position={{
                lat: busLocation.lat,
                lng: busLocation.lng,
            }}
        >
            <BusWrapper>
                <BusIcon />
            </BusWrapper>
        </CustomOverlayMap>
    )
}