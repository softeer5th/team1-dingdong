
// react
import { useRef, useState} from "react";
// kakaoMap
import {Map} from "react-kakao-maps-sdk"
import useKakaoLoader from "@/hooks/useKakaoLoader/useKakaoLoader.ts"
// hook
import useCurrentLocation from "@/hooks/useCurrentLoaction/useCurrentLocation.ts";
// 스타일
import {BusCardSection, PageWrapper} from "@/pages/BusTracker/styles.ts";
// 컴포넌트
import BusStopOverlay from "@/pages/BusTracker/components/BusStopOverlay";
import BusRoute from "@/pages/BusTracker/components/BusRoute";
import BusOverlay from "@/pages/BusTracker/components/BusOverlay";
import UserOverlay from "@/pages/BusTracker/components/UserOverlay";
import LocateMeButton from "@/pages/BusTracker/components/LocateMeButton";
import {useLoaderData} from "react-router-dom";
import {bus_bus_stop_location_interface, bus_path_interface} from "@/route/loader/bus-tracker/loader.tsx";
import PopBox from "@/pages/BusTracker/components/PopBox";
import {
    TO_HOME_ALLOCATED,
    TO_SCHOOL_ALLOCATED,
    users_me_interface,
    users_reservations_interface
} from "@/api/query/users";
import {getBusCardFunction} from "@/pages/Home/utils/getBusCardFunction.tsx";

export interface PositionType {
    lat: number;
    lng: number;
}

export default function BasicMap() {
    useKakaoLoader()
    const userLocation = useCurrentLocation();
    const [busPath, busStopLocation, busSchedule, me]: [bus_path_interface, bus_bus_stop_location_interface, Extract<users_reservations_interface['reservationInfos']['content'][number], TO_SCHOOL_ALLOCATED | TO_HOME_ALLOCATED>, users_me_interface] = useLoaderData();
    const [location, setLocation] = useState({
        // 지도의 초기 위치
        center: { lat: busStopLocation.latitude, lng: busStopLocation.longitude },
        // 지도 위치 변경시 panto를 이용할지에 대해서 정의
        isPanto: false,
    })
    busSchedule.reservationStatus = 'ALLOCATED'
    // 중심 이동 좌표가 동일하면 지도 이동이 안됨. 그것을 약간 씩 조절 해주는 값
    const mapJitter = useRef<number>(0.00000001);

    return (
        <PageWrapper>
            <Map // 지도를 표시할 Container
                id="map"
                center={location.center}
                isPanto={location.isPanto}
                style={{
                    // 지도의 크기
                    width: "100%",
                    height: "100%",
                }}
                level={4} // 지도의 확대 레벨
            >
                {/* 버스 경로 */}
                <BusRoute path={busPath.points.map(({longitude, latitude}) => ({lat: latitude, lng: longitude}))} />
                {/* 버스 정류장 오버레이 */}
                <BusStopOverlay position={{lat: busStopLocation.latitude, lng: busStopLocation.longitude}} boardingPoint={busSchedule.busStopName} />
                {/* 버스 위치 오버레이 */}
                <BusOverlay setLocation={setLocation} isRunning={busSchedule.operationInfo.busStatus === 'RUNNING'}/>
                {/* 사용자 위치 오버레이 */}
                <UserOverlay lat={userLocation.lat} lng={userLocation.lng} />
            </Map>
            <BusCardSection>
                <LocateMeButton onClick={() => {
                    if (userLocation.lat !== -1 || userLocation.lng !== -1) {
                        mapJitter.current *= -1
                        setLocation({
                            center: { lat: userLocation.lat + mapJitter.current, lng: userLocation.lng },
                            isPanto: true,
                        })
                    }
                }}/>
                {
                    getBusCardFunction(busSchedule.direction, busSchedule.reservationStatus)(busSchedule, 0, me.schoolName, false)
                }
            </BusCardSection>
            <PopBox />
        </PageWrapper>
    )
}