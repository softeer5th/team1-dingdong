import { useEffect, useMemo, useRef, useState } from "react";

import ExitHeader from "@/components/Headers/ExitHeader";
import BusSelectMap from "./components/MapWrapper";
import BusSelectBottomModal from "./components/BottomModal";
import ArrowRightIcon from "@/components/designSystem/Icons/FixedRouteBusBooking/ArrowRightIcon";
import {
  Arrival,
  BusSelectSection,
  BusTicketInfo,
  Departure,
  HeaderText,
  RouteMarkHeader,
} from "./styles";
import LocateMeButton from "@/pages/BusTracker/components/LocateMeButton";
import useCurrentLocation from "@/hooks/useCurrentLoaction/useCurrentLocation";
import { useGetBusPath } from "@/hooks/BusBooking/useFixedBooking";

import { ISOStringToDateDayFormat } from "@/utils/fixedBusBooking/ISOStringToDateDay";
import LoadingModal, { mountModal } from "@/components/Loading";
import { useLoaderData } from "react-router-dom";

export default function FixedRouteBookingSelectBus() {
  const { render, unmountModal } = useMemo(() => mountModal(), []);
  const userLocation = useCurrentLocation();
  const { userHomeLocation, busInfoArray, busPath, direction, timeSchedule } =
    useLoaderData();

  const commuteType = direction === "TO_SCHOOL" ? "등교" : "하교";

  const [selectedBusCardIndex, setSelectedBusCardIndex] = useState(0); // 첫번째 버스의 id넣기.
  const [mapCenterLocation, setMapCenterLocation] = useState({
    // 지도의 초기 위치
    center: {
      lat: busInfoArray[selectedBusCardIndex].busStop.latitude, //학동역
      lng: busInfoArray[selectedBusCardIndex].busStop.longitude,
    },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: false,
  });

  const [busStopName, setBusStopName] = useState(
    busInfoArray[selectedBusCardIndex].busStop.name
  ); // 버스 카드를 누르면서 바뀌는 승차지,하차지 이름.

  const mapJitter = useRef<number>(0.00000001);

  const userBusStop = useMemo(
    () => ({
      lat: busInfoArray[selectedBusCardIndex].busStop.latitude,
      lng: busInfoArray[selectedBusCardIndex].busStop.longitude,
    }),
    [selectedBusCardIndex]
  );
  useEffect(() => {
    // 현재 버스카드 id를 가지고 값을 fetch한다.
    // ex) startPoint, endPoint, busPath, 승차지, 하차지 이름 3가지 받기.
    setMapCenterLocation({ center: { ...userBusStop }, isPanto: false });
  }, [selectedBusCardIndex]);

  const { data: selectedBusPath, isBusPathLoading } = useGetBusPath(
    busInfoArray[selectedBusCardIndex].busScheduleId
  );

  useEffect(() => {
    if (isBusPathLoading) {
      render(<LoadingModal text={"버스 경로를 불러오는 중"} />);
    } else {
      unmountModal();
    }
  }, [isBusPathLoading]); // data.isLoading이 변경될 때마다 실행

  const selectedBusPathPoints = busPath;

  const [busPathPoints, setBusPathPoints] = useState(selectedBusPathPoints);

  useEffect(() => {
    setBusPathPoints(selectedBusPathPoints);
  }, [selectedBusPath.data]);

  const clientDataList = useMemo(
    () =>
      // lattitude, longitude 변수 => lat, lng 카카오 맵에 맞게 변환.
      busPathPoints.map(
        ({ latitude, longitude }: { latitude: number; longitude: number }) => ({
          lat: latitude,
          lng: longitude,
        })
      ),
    [busPathPoints] // serverDataList가 변경될 때만 다시 계산
  );

  const locationToMarkOnMap = useMemo(
    () => ({
      startPoint: clientDataList[0],
      endPoint: clientDataList[clientDataList.length - 1],
      busPath: clientDataList,
      userBusStop,
    }),
    [clientDataList, userBusStop]
  ); // 의존성 배열에 필요한 값만 넣어줍니다.
  useEffect(() => {
    setBusPathPoints(selectedBusPathPoints);
    setBusStopName(busInfoArray[selectedBusCardIndex].busStop.name);
  }, [busInfoArray]);

  return (
    <>
      <ExitHeader text="함께 타기" />
      <RouteMarkHeader>
        <HeaderText>
          <Departure>{commuteType === "등교" ? "집" : "학교"}</Departure>
          <ArrowRightIcon />
          <Arrival>{commuteType === "등교" ? "학교" : "집"}</Arrival>
        </HeaderText>
        <BusTicketInfo>
          {ISOStringToDateDayFormat(timeSchedule)}
          {commuteType === "등교" ? "도착" : "출발"}
        </BusTicketInfo>
      </RouteMarkHeader>
      <BusSelectMap
        houseInfo={userHomeLocation.houseInfo}
        commuteType={commuteType}
        mapCenterLocation={mapCenterLocation}
        locationToMarkOnMap={locationToMarkOnMap}
        locationName={busStopName}
      />
      <BusSelectSection>
        <LocateMeButton
          onClick={() => {
            if (userLocation.lat !== -1 || userLocation.lng !== -1) {
              mapJitter.current *= -1;
              setMapCenterLocation({
                center: {
                  lat: userLocation.lat + mapJitter.current,
                  lng: userLocation.lng,
                },
                isPanto: true,
              });
            }
          }}
        />
        <BusSelectBottomModal
          busPathPoints={busPathPoints}
          busInfoArray={busInfoArray}
          selectedBusCardIndex={selectedBusCardIndex}
          setSelectedBusCardIndex={setSelectedBusCardIndex}
        />
      </BusSelectSection>
    </>
  );
}
