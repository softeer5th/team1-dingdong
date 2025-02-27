import React, { useEffect, useRef, useState } from "react";
import * as S from "./styles";
import ChevronLeftIcon from "@/components/designSystem/Icons/ChevronLeftIcon";
import { colors } from "@/styles/colors";
import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
import TimeTableRecommendationButton from "@/components/Button/TimeTableRecommendationButton";
import useCalendar from "@/pages/BusBooking/hooks/useCalendar";
import { formatMonthName, getDaysInMonth, isDateDisabled } from "@/utils/calendar/calendarUtils";
import * as constant from "@/constants/calendarConstants";
import Polygon from "@/components/designSystem/Icons/PolygonIcon";
import { CommuteType } from "@/pages/BusBooking/types/commuteType";
import SelectTimeBottomModal from "../SelectTimeBottomModal";
import { timeScheduleActions } from "@/pages/BusBooking/store/actions";
import { TimeSchedule, TimeScheduleAction } from "@/pages/BusBooking/store/types";
import { timeScheduleSelectors } from "@/pages/BusBooking/store/selectors";
import { useGetTimeTableRecommendation } from "@/hooks/BusBooking/useCustomBooking";
import { mountModal } from "@/components/Loading";
import Modal from "@/components/Modal";
import { useNavigate } from "react-router-dom";
// import { useGetHomeLocation } from "@/hooks/setHomeLocation/useHomeLocation";
// import { useGetAIRecommendation } from "@/hooks/BusBooking/useCustomBooking";

interface CalendarViewProps {
  selectedTimeSchedule: TimeSchedule; // 총 반영된 선택된 시간
  dispatch: React.Dispatch<TimeScheduleAction>; // 선택시, 업데이트에 사용할 dispatch
  commuteType: CommuteType;
}
export default function CalendarView({ commuteType, selectedTimeSchedule, dispatch }: CalendarViewProps) {
  // AI 버튼 관리

  const [AIBtnToggles, setAIBtnToggles] = useState([false, false, false]); // 3개의 month에서 각각 다루는 AI 적용 버튼 토글.

  const navigate = useNavigate();
  // 현재 화면 캘린저
  const { currentDate, goToNextMonth, goToPreviousMonth } = useCalendar();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [toolTipOn, setToolTipOn] = useState(true);
  const [isTimeSelectModalOpen, setIsTimeSelectModalOpen] = useState(false);
  const [dateButtonWidth, setDateButtonWidth] = useState(0);
  // const [selectedDay, setSelectedDay] = useState<number>(0);

  // 임시 선택 상태를 저장할 state 추가
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({ year: currentDate.year, month: currentDate.month + 1, day: 0 });

  const timeTableRecommendationArray: string[] | null =
    useGetTimeTableRecommendation({
      yearMonth: `${currentDate.year}-${(currentDate.month + 1).toString().padStart(2, "0")}`,
      direction: commuteType === "등교" ? "TO_SCHOOL" : "TO_HOME",
    }).data?.data?.suggestionDates ?? null;

  const makingTimeTableSuggestion = (type: string) => {
    const { render, unmountModal } = mountModal();
    const titleType = type === "none" ? "시간표가 등록되지 않았어요" : "등록하신 시간표는\n예매 가능한 시간대가 없어요";
    render(
      <Modal
        title={[titleType]}
        text={["시간표 등록을 하러 가볼까요?"]}
        isError={false}
        leftButton={{
          text: "취소",
          onClick: () => {
            render(<></>);
          },
        }}
        rightButton={{
          text: "등록하기",
          onClick: () => {
            unmountModal();
            navigate("/timetable-management");
          },
        }}
      />
    );
  };

  const months = useRef([
    getDaysInMonth(currentDate.year, currentDate.month),
    getDaysInMonth(currentDate.year, currentDate.month + 1),
    getDaysInMonth(currentDate.year, currentDate.month + 2),
  ]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const newScreenWidth = screenWidth <= constant.MAX_MOBILE_WIDTH ? screenWidth : constant.LAYOUT_WIDTH;

    const dayButtonWidth =
      (newScreenWidth - constant.TOTAL_LEFT_RIGHT_PADDING - constant.TOTAL_CALENDAR_COLUMN_GAP) /
      constant.WEEKDAYS_COUNT;

    setDateButtonWidth(dayButtonWidth);
  }, []);

  // 모달이 닫힐 때 임시 선택 상태를 초기화
  useEffect(() => {
    if (!isTimeSelectModalOpen) {
      setSelectedDate({ ...selectedDate, day: 0 });
    }
  }, [isTimeSelectModalOpen]);

  const handleTimeTableRecommendation = () => {
    // AI 추천 로직 (API 호출 등)
    setToolTipOn(false);

    if (AIBtnToggles[currentMonthIndex]) {
      dispatch(
        timeScheduleActions.clearTimeTableRecommendations({
          year: currentDate.year,
          month: currentDate.month + 1, // 현재 달력에서 선택된 날짜.
        })
      );
    } else {
      if (timeTableRecommendationArray === null) {
        makingTimeTableSuggestion("none");
        return;
      }
      if (timeTableRecommendationArray.length === 0) {
        // 모달 호출
        makingTimeTableSuggestion("empty");
        return;
      }
      dispatch(
        timeScheduleActions.setTimeTableRecommendations({
          ...currentDate,
          month: currentDate.month + 1,
          recommendations: timeTableRecommendationArray!,
        })
      );
    }
    setAIBtnToggles((prev) => [
      ...prev.slice(0, currentMonthIndex), // 이전 상태의 앞부분 그대로
      !prev[currentMonthIndex], // 현재 인덱스만 반전
      ...prev.slice(currentMonthIndex + 1), // 이후 상태 그대로
    ]);
  };

  const isDateHighlighted = (year: number, month: number, day: number) => {
    // 실제 선택된 시간이 있는지 확인

    const hasScheduledTime = timeScheduleSelectors.hasScheduledTime({
      timeSchedule: selectedTimeSchedule,
      year: currentDate.year,
      month: currentDate.month + 1,
      day: day,
    });

    // 임시 선택 상태 확인
    const isTempSelected = selectedDate?.year === year && selectedDate?.month === month && selectedDate?.day === day;

    return hasScheduledTime || isTempSelected;
  };

  useEffect(() => {
    setAIBtnToggles(new Array(3).fill(false));
  }, [commuteType]);

  return (
    <S.CalendarWrapper>
      {/* 시각 선택 모달 */}
      <SelectTimeBottomModal
        selectedTimeSchedule={selectedTimeSchedule}
        dispatch={dispatch}
        selectedDate={{ ...selectedDate }}
        isTimeSelectModalOpen={isTimeSelectModalOpen}
        setIsTimeSelectModalOpen={setIsTimeSelectModalOpen}
        commuteType={commuteType}
      />

      {toolTipOn && (
        <S.ToopTip>
          내 시간표에 맞는 도착 시간을 자동선택해줘요
          <Polygon />
        </S.ToopTip>
      )}

      <S.CalendarHeader>
        <S.MonthNavigator>
          <S.IconWrapper
            onClick={() => {
              if (currentMonthIndex === 0) return;
              setCurrentMonthIndex(currentMonthIndex - 1);
              goToPreviousMonth(commuteType);
            }}
          >
            <ChevronLeftIcon size={24} fill={colors.gray50} />
          </S.IconWrapper>

          <S.CurrentMonth>{formatMonthName(currentDate.month + 1)}</S.CurrentMonth>
          <S.IconWrapper
            onClick={() => {
              if (currentMonthIndex === 2) return;
              goToNextMonth(commuteType);
              setCurrentMonthIndex(currentMonthIndex + 1);
            }}
          >
            <ChevronRightIcon size={24} fill={colors.gray50} />
          </S.IconWrapper>
        </S.MonthNavigator>
        <TimeTableRecommendationButton
          active={AIBtnToggles[currentMonthIndex]}
          onClick={handleTimeTableRecommendation}
        />
      </S.CalendarHeader>

      <S.DateHeader>
        {constant.WEEKDAYS.map((weekday) => (
          <S.Weekday key={weekday}>{weekday}</S.Weekday>
        ))}
      </S.DateHeader>

      <S.GridWrapper $monthIndex={currentMonthIndex}>
        {months.current.map((array: (string | number)[], index) => (
          <S.GridContainer key={index} $visible={currentMonthIndex === index}>
            {array.map((day: number | string, dayIndex) => {
              if (typeof day === "number") {
                const date = new Date(currentDate.year, currentDate.month, +day);
                const disabledDate = isDateDisabled(date, commuteType);
                return (
                  <S.DayButton
                    onClick={() => {
                      setIsTimeSelectModalOpen(true);
                      setSelectedDate({
                        year: currentDate.year,
                        month: currentDate.month + 1,
                        day,
                      });
                    }}
                    $width={dateButtonWidth}
                    disabled={disabledDate}
                    key={`${day}-${dayIndex}`}
                    $isHighlighted={isDateHighlighted(currentDate.year, currentDate.month + 1, day)}
                  >
                    {day}
                  </S.DayButton>
                );
              } else {
                return (
                  <S.DayButton $width={dateButtonWidth} key={`${day}-${dayIndex}`} $isHighlighted={false}>
                    {day}
                  </S.DayButton>
                );
              }
            })}
          </S.GridContainer>
        ))}
      </S.GridWrapper>
    </S.CalendarWrapper>
  );
}
