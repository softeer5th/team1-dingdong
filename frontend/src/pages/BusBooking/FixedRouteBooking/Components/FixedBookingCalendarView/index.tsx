import React, { useEffect, useRef, useState } from "react";
import * as S from "./styles";
import ChevronLeftIcon from "@/components/designSystem/Icons/ChevronLeftIcon";
import { colors } from "@/styles/colors";
import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
// import AIRecommendationButton from "@/components/Button/AIRecommendationButton";
import useCalendar from "@/pages/BusBooking/hooks/useCalendar";
import { formatMonthName, getDaysInMonth, isDateDisabled } from "@/utils/calendar/calendarUtils";
import * as constant from "@/constants/calendarConstants";
import { CommuteType } from "@/pages/BusBooking/types/commuteType";
import { SelectedDateType } from "../../page";
import { getEarliestMonth } from "@/utils/fixedBusBooking/getEarliestMonthUtils";

interface FixedBookingCalendarViewProps {
  busTimeSchedule: string[];
  selectedDate: SelectedDateType | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<SelectedDateType | null>>; // 핀을 움직여서, 바텀 시트를 보여준다.
  commuteType: CommuteType;
}

export default function FixedBookingCalendarView({
  busTimeSchedule,
  selectedDate,
  setSelectedDate,
  commuteType,
}: FixedBookingCalendarViewProps) {
  // AI 버튼 관리

  // 현재 화면 캘린저
  console.log(getEarliestMonth(busTimeSchedule));
  const { currentDate, goToNextMonth, goToPreviousMonth } = useCalendar("fixed-bus-booking", busTimeSchedule);

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const [dateButtonWidth, setDateButtonWidth] = useState(0);

  const shouldIncludeNextMonth = useRef(false);
  const daysArray = [getDaysInMonth(currentDate.year, currentDate.month)];

  if (shouldIncludeNextMonth.current) {
    daysArray.push(getDaysInMonth(currentDate.year, currentDate.month + 1));
  }

  // 주는 월 중에 가장 빠른 월 찾아서 셋팅.

  const months = useRef([
    getDaysInMonth(currentDate.year, currentDate.month),
    getDaysInMonth(currentDate.year, currentDate.month + 1),
  ]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const newScreenWidth = screenWidth <= constant.MAX_MOBILE_WIDTH ? screenWidth : constant.LAYOUT_WIDTH;

    const dayButtonWidth =
      (newScreenWidth - constant.TOTAL_LEFT_RIGHT_PADDING - constant.TOTAL_CALENDAR_COLUMN_GAP) /
      constant.WEEKDAYS_COUNT;

    setDateButtonWidth(dayButtonWidth);
  }, []);

  const isDateHighlighted = (year: number, month: number, day: number) => {
    // 실제 선택된 시간이 있는지 확인

    // 임시 선택 상태 확인
    const isSelected = selectedDate?.year === year && selectedDate?.month === month && selectedDate?.day === day;

    return isSelected;
  };

  const isHaveSchedule = (date: Date) => {
    const result = busTimeSchedule.some(
      (schedule) =>
        date.getFullYear() === new Date(schedule).getFullYear() &&
        date.getMonth() === new Date(schedule).getMonth() &&
        date.getDate() === new Date(schedule).getDate()
    );

    return result;
  };

  const hasAnySchedule = busTimeSchedule.length > 0;
  const lastDayCanBook = busTimeSchedule[busTimeSchedule.length - 1];

  const isPrevActive = hasAnySchedule && goToPreviousMonth(commuteType, "fixedBusBooking");
  const isNextActive = hasAnySchedule && goToNextMonth(commuteType, "fixedBusBooking", lastDayCanBook);

  return (
    <S.CalendarWrapper>
      <S.CalendarHeader>
        <S.MonthNavigator>
          <S.CurrentMonth>
            {currentDate.year}년 {formatMonthName(currentDate.month + 1)}
          </S.CurrentMonth>

          <S.IconBox>
            <S.IconWrapper
              onClick={() => {
                if (!isPrevActive) return;
                setCurrentMonthIndex(currentMonthIndex - 1);
              }}
            >
              <ChevronLeftIcon size={24} fill={isPrevActive ? colors.gray50 : colors.gray40} />
            </S.IconWrapper>

            <S.IconWrapper
              onClick={() => {
                if (!isNextActive) return;
                setCurrentMonthIndex(currentMonthIndex + 1);
              }}
            >
              <ChevronRightIcon size={24} fill={isNextActive ? colors.gray50 : colors.gray40} />
            </S.IconWrapper>
          </S.IconBox>
        </S.MonthNavigator>
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
                const disabledDate = isDateDisabled(date, commuteType, "fixedBusBooking");

                return (
                  <S.DayButton
                    onClick={() => {
                      setSelectedDate({
                        year: currentDate.year,
                        month: currentDate.month + 1,
                        day,
                      });
                    }}
                    $width={dateButtonWidth}
                    disabled={disabledDate || !isHaveSchedule(date)}
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
