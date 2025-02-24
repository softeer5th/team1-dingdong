import {BusWrapper} from "@/pages/BusTracker/components/BusOverlay/styles.ts";
import {CustomOverlayMap} from "react-kakao-maps-sdk";
import {PositionType} from "@/pages/BusTracker/page.tsx";
import BusIcon from "@/components/designSystem/Icons/BusTracker/BusIcon.tsx";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {axiosInstance} from "@/api";
import {useSocket} from "@/hooks/useSocket";
import {useSearchParams} from "react-router-dom";


interface BusOverlayProps {
    setLocation:  Dispatch<SetStateAction<{
        center: {lat: number, lng: number},
        isPanto: boolean
    }>>
    isRunning: boolean
}
export default function BusOverlay({setLocation, isRunning}: BusOverlayProps) {
    const [busLocation, setBusLocation] = useState<PositionType>({
        lat: 0,
        lng: 0
    })
    const {ws} = useSocket()
    const [searchParams] = useSearchParams();
    const busScheduleId = searchParams.get("busScheduleId");
    const isFirst = useRef(true)

    useEffect(() => {
        if (!(ws instanceof WebSocket)) return;
        if (!isRunning) return
        // 소켓 있고, 버스가 출발 상태이면

        const handleMessage = (message: MessageEvent) => {
            try {
                const data = JSON.parse(message.data);

                // 데이터 구조 검증
                if (typeof data !== "object" || data === null) {
                    console.error("데이터가 객체가 아닙니다.");
                    return;
                }
                if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
                    console.error("latitude와 longitude가 숫자가 아닙니다.");
                    return;
                }

                setBusLocation({
                    lat: data.latitude,
                    lng: data.longitude,
                });

                if (isFirst.current) {
                    isFirst.current = false;
                    setLocation({
                        center: {lat: data.latitude, lng: data.longitude},
                        isPanto: true
                    })
                }


                console.log("버스 정보", data);
            } catch (error) {
                console.error("JSON 파싱 에러:", error);
            }
        };

        // 메시지 처리 함수 등록
        ws.addEventListener("message", handleMessage);


        axiosInstance.post(`/api/bus/subscription/${busScheduleId}`)
            .then(() => console.log("구독 성공"))
            .catch((error) => console.log("구독 실패", error))

        console.log("구독 시작")


        return () => {
            ws.removeEventListener("message", handleMessage); // 언마운트 시 이벤트 리스너 삭제
            axiosInstance.delete(`/api/bus/subscription/${busScheduleId}`)
        };

    }, [ws, setBusLocation, busScheduleId, isRunning]);



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