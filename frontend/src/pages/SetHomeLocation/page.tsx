import SetLocationHomeMap from "./components/MapWrapper";
import SetLocationBottomModal from "./components/BottomModal";
import { useState } from "react";
import PopHeader from "@/components/Headers/PopHeader";
import { useLoaderData } from "react-router-dom";

import useKakaoLoader from "@/hooks/useKakaoLoader/useKakaoLoader";
// import { useHomeLocation } from "@/hooks/setHomeLocation/useHomeLocation";

export interface LocationInfo {
  latitude: number;
  longitude: number;
}
export default function SetHomeLocation() {
  useKakaoLoader();

  const [houseAndStationInfo] = useLoaderData();

  const { houseInfo } = houseAndStationInfo;

  const [roadAddress, setRoadAddress] = useState<string | null>("");
  const [stationInfo, setStationInfo] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const initHomePosition = {
    lat: houseInfo.latitude,
    lng: houseInfo.longitude,
  };

  return (
    <>
      <PopHeader text="탑승지 위치 설정" />
      <SetLocationHomeMap
        userHomeCoordinate={initHomePosition}
        setStationInfo={setStationInfo}
        setRoadAddress={setRoadAddress}
        setShowBottomSheet={setShowBottomSheet}
      />
      <SetLocationBottomModal
        stationInfo={stationInfo}
        roadAddress={roadAddress}
        showBottomSheet={showBottomSheet}
      />
    </>
  );
}
