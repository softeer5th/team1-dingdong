import { useEffect, useRef } from "react";
import {
  Destination,
  EndPointText,
  HomePinContainer,
  HomePinMark,
  HomePinTitle,
  MapWrapper,
  UserHomePinContainer,
  UserHomePinMark,
} from "./styles";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader/useKakaoLoader.ts";
import PinIcon from "@/components/designSystem/Icons/PinIcon";
import { colors } from "@/styles/colors";
import LocationMarkerIcon from "@/components/designSystem/Icons/FixedRouteBusBooking/LocationMarker";
import EndPointPinMarkIcon from "@/components/designSystem/Icons/FixedRouteBusBooking/EndPointPinMarkIcon";
import useCurrentLocation from "@/hooks/useCurrentLoaction/useCurrentLocation";
import UserOverlay from "@/pages/BusTracker/components/UserOverlay";
import { CommuteType } from "@/pages/BusBooking/types/commuteType";
import BusRoute from "@/pages/BusTracker/components/BusRoute";
import HomeIcon from "@/components/designSystem/Icons/HomeIcon";

interface HouseInfo {
  latitude: number;
  longitude: number;
}
interface SetLocationHomeMapProps {
  houseInfo: HouseInfo;
  commuteType: CommuteType;
  mapCenterLocation: {
    center: { lat: number; lng: number };
    isPanto: boolean;
  };
  locationToMarkOnMap: {
    startPoint: { lat: number; lng: number };
    endPoint: { lat: number; lng: number };
    userBusStop: { lat: number; lng: number };
    busPath: { lat: number; lng: number }[];
  };
  locationName: string;
}

export default function BusSelectMap({
  houseInfo,
  mapCenterLocation,
  locationName,
  locationToMarkOnMap,
}: SetLocationHomeMapProps) {
  useKakaoLoader();

  const { startPoint, endPoint } = locationToMarkOnMap;
  const userLocation = useCurrentLocation();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  const { direction } = JSON.parse(
    sessionStorage.getItem("/fixed-bus-booking")!
  ); // 이전 예약 정보.
  const departureOrArrivalPinText = direction === "TO_SCHOOL" ? "도착" : "출발";

  // 📌 **onCreate를 사용해 mapRef 설정**
  const handleMapCreate = (map: kakao.maps.Map) => {
    if (!mapRef.current) {
      mapRef.current = map;
      updateMapBounds();
    }
  };

  // 📌 **지도 경계 업데이트 함수**
  const updateMapBounds = () => {
    if (!mapRef.current || !startPoint || !endPoint) return;

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(startPoint.lat, startPoint.lng));
    bounds.extend(new kakao.maps.LatLng(endPoint.lat, endPoint.lng));

    setTimeout(() => {
      mapRef.current?.setBounds(bounds, 20); // Use a single padding number
    }, 100);
  };

  // 📌 **좌표가 변경될 때마다 setBounds 실행**
  useEffect(() => {
    updateMapBounds();
  }, [locationToMarkOnMap]);

  // 📌 **화면 크기가 변경될 때도 setBounds 실행**
  useEffect(() => {
    const handleResize = () => {
      updateMapBounds();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [locationToMarkOnMap]);

  return (
    <MapWrapper>
      <Map
        center={mapCenterLocation.center}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
      >
        <BusRoute path={locationToMarkOnMap.busPath} />
        <CustomOverlayMap position={locationToMarkOnMap.userBusStop}>
          <HomePinContainer>
            <HomePinMark>
              <LocationMarkerIcon />
              <Destination>{locationName}</Destination>
            </HomePinMark>
            <PinIcon stroke={colors.gray90} />
          </HomePinContainer>
        </CustomOverlayMap>

        <CustomOverlayMap position={locationToMarkOnMap.endPoint}>
          <EndPointText>{departureOrArrivalPinText}</EndPointText>
          <EndPointPinMarkIcon />
        </CustomOverlayMap>

        <CustomOverlayMap
          position={{
            lat: houseInfo.latitude,
            lng: houseInfo.longitude,
          }}
        >
          <UserHomePinContainer>
            <UserHomePinMark>
              <HomePinTitle>
                <HomeIcon fill={colors.white} />
              </HomePinTitle>
            </UserHomePinMark>
            <PinIcon stroke={colors.orange900} />
          </UserHomePinContainer>
        </CustomOverlayMap>

        <UserOverlay lat={userLocation.lat} lng={userLocation.lng} />
      </Map>
    </MapWrapper>
  );
}
