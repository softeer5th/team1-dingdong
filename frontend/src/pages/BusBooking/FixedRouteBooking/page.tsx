import ExitHeader from "@/components/Headers/ExitHeader";
import { useEffect, useState } from "react";

import SolidButton from "@/components/designSystem/Button/SolidButton";
import { CommuteType } from "../types/commuteType";

import FixedBookingCommuteSwitcher from "./Components/FixedBookingCommuteSwitcher";
import FixedBookingCalendarView from "./Components/FixedBookingCalendarView";
import TimeSelectButtons from "./Components/TimeSelectButtons";
import { DescriptionText, Info, NextButtonContainer, ShowSelectedSchedule, Subtitle } from "./styles";
import { convertInfoToText } from "@/utils/calendar/fixedBusBookingUtils";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useGetBusTimeSchedule } from "@/hooks/BusBooking/useFixedBooking";
import { convertToISOStringArray } from "@/utils/fixedBusBooking/timeObjectToString";
import { useCustomNavigate } from "@/hooks/useNavigate";

import Modal from "@/components/Modal";
import { transformSchedules } from "@/utils/fixedBusBooking/busTimeScheduleStringToObject";
import { mountModal } from "@/components/Loading";
import { colors } from "@/styles/colors";
// import { useGetAvailableBusInfo } from "@/hooks/BusBooking/useFixedBooking";

export interface SelectedTimeType {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface SelectedDateType {
  year: number;
  month: number;
  day: number;
}

export type timeType = {
  hour: number;
  minute: number;
};

export default function FixedRouteBooking() {
  // 예매 나가기 모달 상태관리

  const navigate = useNavigate();

  const [selectedHourMinute, setSelectedHourMinute] = useState<timeType | null>(null);
  const [selectedDate, setSelectedDate] = useState<SelectedDateType | null>(null);

  const [commuteType, setCommuteType] = useState<CommuteType>("등교");

  const loaderData = useLoaderData()[2].schedules; // loader 는 처음에만 사용

  const [busTimeSchedule, setBusTimeSchedule] = useState<string[]>(loaderData ?? []);

  // get 요청 정보
  const busTimeResponse = useGetBusTimeSchedule(commuteType === "등교" ? "TO_SCHOOL" : "TO_HOME");

  // 서버에서 새로운 데이터가 들어오면 업데이트
  useEffect(() => {
    if (busTimeResponse?.data?.data?.schedules.length > 0) {
      setBusTimeSchedule(busTimeResponse?.data?.data.schedules);
    }
  }, [busTimeResponse]);

  const sortedBusTimeSchedule = busTimeSchedule.sort(
    (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()
  );

  const busTimeScheduleObjectArray = transformSchedules(sortedBusTimeSchedule);

  const exitButtonHandler = () => {
    // 모달 오픈. ( 예매를 취소 하시겠어요 ?)
    const { render, unmountModal } = mountModal();
    render(
      <Modal
        title={["다음에 다시 예약할까요?"]}
        text={["예매 내역이 저장되지 않습니다."]}
        isError={false}
        leftButton={{
          text: "취소",
          onClick: () => {
            unmountModal();
          },
        }}
        rightButton={{
          text: "나가기",
          onClick: () => {
            unmountModal();
            navigate("/home");
          },
        }}
      />
    );
  };

  const [showInfo, setShowInfo] = useState("-");

  const [timeArrayDependOnDate, setTimeArrayDependOnDate] = useState<timeType[]>(
    busTimeScheduleObjectArray[JSON.stringify(selectedDate)] ?? []
  );

  useEffect(() => {
    setTimeArrayDependOnDate(busTimeScheduleObjectArray[JSON.stringify(selectedDate)] ?? []);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && selectedHourMinute) {
      setShowInfo(convertInfoToText(selectedDate, selectedHourMinute));
    } else {
      setShowInfo("-");
    }
  }, [selectedDate, selectedHourMinute]);

  const navigateCustom = useCustomNavigate();

  const nextButtonHandler = async () => {
    const selectTimeScheduleArray = convertToISOStringArray(
      // ISOString으로 변환
      selectedDate!,
      selectedHourMinute!
    );

    const direction = commuteType === "등교" ? "TO_SCHOOL" : "TO_HOME";

    navigateCustom("/fixed-bus-select-bus", {
      direction,
      timeSchedule: selectTimeScheduleArray[0],
    });
  };
  const [{ schoolName }] = useLoaderData();
  console.log(busTimeSchedule, "스케줄");
  return (
    <>
      <ExitHeader text="함께타기" onClick={exitButtonHandler} />
      {/* 출퇴근 스위치역할 뷰.  */}
      <FixedBookingCommuteSwitcher
        schoolName={schoolName}
        setSelectedHourMinute={setSelectedHourMinute}
        setSelectedDate={setSelectedDate}
        commuteType={commuteType}
        setCommuteType={setCommuteType}
      />

      {busTimeSchedule.length === 0 ? (
        <DescriptionText $color={colors.orange900}>‼️ 현재 {commuteType}시 확정된 버스가 없습니다</DescriptionText>
      ) : (
        <DescriptionText>일자를 선택해 시각을 선택해주세요</DescriptionText>
      )}

      <FixedBookingCalendarView
        busTimeSchedule={sortedBusTimeSchedule}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        commuteType={commuteType}
      />

      <TimeSelectButtons
        decidedSchedule={timeArrayDependOnDate}
        selectedHourMinute={selectedHourMinute}
        setSelectedHourMinute={setSelectedHourMinute}
      />

      <ShowSelectedSchedule>
        <Subtitle>도착 시각</Subtitle>
        <Info>{showInfo}</Info>
      </ShowSelectedSchedule>
      <NextButtonContainer onClick={nextButtonHandler}>
        <SolidButton text="다음" active={selectedDate !== null && selectedHourMinute !== null} />
      </NextButtonContainer>
    </>
  );
}
// 시간 선택 모달은 달력에서 한 번,
// page.tsx에서 한 번.
