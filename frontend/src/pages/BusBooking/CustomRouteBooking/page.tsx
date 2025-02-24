import ExitHeader from "@/components/Headers/ExitHeader";
import { useMemo, useReducer, useState } from "react";
import CommuteSwitcher from "./components/CommuteSwitcher";
import InfoIcon from "@/components/designSystem/Icons/InfoIcon";
import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
import CalendarView from "./components/CalendarView";
import {
  BottomContainer,
  ButtonTitle,
  ConfirmButtonWrapper,
  CountViewBox,
  DetailText,
  InfoTextBox,
  ScheduleCount,
  Title,
  TotalEditableViewButton,
} from "./styles";
import SolidButton from "@/components/designSystem/Button/SolidButton";
import { CommuteType, OverlayBottomModalType } from "../types/commuteType";

import TimeViewBottomModal from "./components/TimeViewBottomModal";
import { timeScheduleReducer } from "../store/reducer";
import { getSelectedDaysCount } from "@/utils/calendar/calendarUtils";
import { timeScheduleSelectors } from "../store/selectors";
import SelectTimeBottomModal from "./components/SelectTimeBottomModal";
import { convertIsoToDateObject } from "@/utils/calendar/timeViewBottomModalUtil";
import { mountModal } from "@/components/Loading";
import Modal from "@/components/Modal";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function CustomRouteBooking() {
  const [selectedTimeSchedule, dispatch] = useReducer(timeScheduleReducer, {});
  const navigate = useNavigate();

  const [
    { schoolName },
    {
      stationInfo: { name: stationName },
    },
  ] = useLoaderData();

  const exitButtonHandler = () => {
    // 모달 오픈
    const { render, unmountModal } = mountModal();
    render(
      <Modal
        title={["다음에 다시 예약할까요?"]}
        text={["예매 내역이 저장되지 않습니다."]}
        isError={false}
        leftButton={{
          text: "취소",
          onClick: () => {
            render(<></>);
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
  const [commuteType, setCommuteType] = useState<CommuteType>("등교");
  const [overlayBottomModalType, setOverlayBottomModalType] =
    useState<OverlayBottomModalType>("editable");

  const [timeViewModalOpen, setTimeViewModalOpen] = useState(false);

  // useMemo로 캐시된 selectedTimeSchedule 값을 가져옴
  const cachedSelectedTimeSchedules = useMemo<string[]>(
    () => timeScheduleSelectors.getAllTimeScheduleToArray(selectedTimeSchedule),
    [selectedTimeSchedule] // selectedTimeSchedule 값이 변경될 때만 재계산
  );

  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>(convertIsoToDateObject(cachedSelectedTimeSchedules[0]));

  const [isTimeSelectModalOpen, setIsTimeSelectModalOpen] = useState(false);
  return (
    <>
      <ExitHeader text="버스예매" onClick={exitButtonHandler} />
      {/* 출퇴근 스위치역할 뷰.  */}
      <CommuteSwitcher
        boardingInfo={{ schoolName, stationName }}
        commuteType={commuteType}
        setCommuteType={setCommuteType}
        dispatch={dispatch}
        selectedTimeSchedule={selectedTimeSchedule}
      />
      <Title>일자를 선택해 시각을 설정해주세요</Title>
      <CalendarView
        commuteType={commuteType}
        dispatch={dispatch}
        selectedTimeSchedule={selectedTimeSchedule}
      />

      <BottomContainer>
        <InfoTextBox>
          <InfoIcon />
          <DetailText>탑승권은 2일 후부터 예매 가능해요.</DetailText>
        </InfoTextBox>

        <TotalEditableViewButton
          onClick={() => {
            setTimeViewModalOpen(true);
            setOverlayBottomModalType("editable");
          }}
        >
          <ButtonTitle>선택한 일정</ButtonTitle>
          <CountViewBox>
            {/* 전체 일정을 들고오기. 그 중 빠른 일자를 앞으로. 없으면- */}
            <ScheduleCount>
              {cachedSelectedTimeSchedules.length > 0
                ? getSelectedDaysCount(cachedSelectedTimeSchedules)
                : "-"}
            </ScheduleCount>
            <ChevronRightIcon />
          </CountViewBox>
        </TotalEditableViewButton>

        <TimeViewBottomModal
          setSelectedDate={setSelectedDate}
          setIsTimeSelectModalOpen={setIsTimeSelectModalOpen}
          selectedTimeSchduleArray={cachedSelectedTimeSchedules}
          isEditablTimeViewModalOpen={timeViewModalOpen}
          setIsEditablTimeViewModalOpen={setTimeViewModalOpen}
          commuteType={commuteType}
          modalType={overlayBottomModalType}
        />

        <SelectTimeBottomModal
          selectedTimeSchedule={selectedTimeSchedule}
          dispatch={dispatch}
          selectedDate={{ ...selectedDate }}
          isTimeSelectModalOpen={isTimeSelectModalOpen}
          setIsTimeSelectModalOpen={setIsTimeSelectModalOpen}
          commuteType={commuteType}
        />

        <ConfirmButtonWrapper>
          <SolidButton
            onClick={() => {
              setOverlayBottomModalType("lastStep");
              setTimeViewModalOpen(true);
            }}
            text="선택 일정 최종 확인하기"
          />
        </ConfirmButtonWrapper>
      </BottomContainer>
    </>
  );
}
// 시간 선택 모달은 달력에서 한 번,
// page.tsx에서 한 번.
