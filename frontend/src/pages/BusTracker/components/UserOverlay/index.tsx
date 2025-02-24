import {CustomOverlayMap} from "react-kakao-maps-sdk";
import {PositionType} from "@/pages/BusTracker/page.tsx";
import UserLocationIcon from "@/components/designSystem/Icons/BusTracker/UserLocationIcon.tsx";


export default function UserOverlay({lat, lng}: PositionType) {

    return (
        <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
            // 커스텀 오버레이가 표시될 위치입니다
            position={{
                lat: lat,
                lng: lng,
            }}
        >
            <UserLocationIcon />
        </CustomOverlayMap>
    )
}