import {Polyline} from "react-kakao-maps-sdk";
import {PositionType} from "@/pages/BusTracker/page.tsx";

interface BusRouteProps {
    path: PositionType[]
}
export default function BusRoute({path}: BusRouteProps) {

    return (
        <Polyline
            path={[path]}
            strokeWeight={6} // 선의 두께 입니다
            strokeColor={"#53A9FF"} // 선의 색깔입니다
            strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle={"solid"} // 선의 스타일입니다
        />
    )
}