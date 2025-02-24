import {BusStopInfoBox, BusStopOverlayWrapper} from "@/pages/BusTracker/components/BusStopOverlay/styles.ts";
import {CustomOverlayMap} from "react-kakao-maps-sdk";
import {PositionType} from "@/pages/BusTracker/page.tsx";
import BusStopLocationIcon from "@/components/designSystem/Icons/BusTracker/BusStopLocationIcon.tsx";
import BusStopLocationPinIcon from "@/components/designSystem/Icons/BusTracker/BusStopLocationPinIcon.tsx";


interface BusStopOverlayProps {
    position: PositionType;
    boardingPoint: string;
}
export default function BusStopOverlay({position: {lat, lng}, boardingPoint}: BusStopOverlayProps ) {

    return (

        <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
            // 커스텀 오버레이가 표시될 위치입니다
            position={{
                lat: lat,
                lng: lng,
            }}
        >
            {/* 커스텀 오버레이에 표시할 내용입니다 */}
            <BusStopOverlayWrapper>
                <BusStopInfoBox>
                    <BusStopLocationIcon />
                    <span>
                        {boardingPoint}
                    </span>
                    <span>
                        탑승
                    </span>
                </BusStopInfoBox>
                <BusStopLocationPinIcon />
            </BusStopOverlayWrapper>
        </CustomOverlayMap>
    )
};