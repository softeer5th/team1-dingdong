import {
  availableBookingMinDate,
  isDateDisabled,
  totalDaysInMonth,
} from "@/utils/calendar/calendarUtils";
import { useState } from "react";
import { CommuteType } from "../types/commuteType";
export default function useCalendar(calendarType = "customBooking") {
  const [currentDate, setCurrentDate] = useState(() => {
    if (calendarType === "customBooking") {
      const minDateCanBooking = availableBookingMinDate();
      return {
        year: minDateCanBooking.getFullYear(),
        month: minDateCanBooking.getMonth(), //  (0: 1월, 1: 2월, ...)
      };
    } else {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(), //  (0: 1월, 1: 2월, ...)
      };
    }
  });

  // 이전 달로 이동
  const goToPreviousMonth = (
    commuteType: CommuteType,
    calendarType = "customBooking"
  ) => {
    const daysInMonth = totalDaysInMonth(currentDate.year, currentDate.month);
    let [year, month, day] = [
      currentDate.year,
      currentDate.month - 1,
      daysInMonth,
    ];

    if (currentDate.month < 0) {
      year = currentDate.year - 1;
      month = 11;
    }

    const date = new Date(year, month, day);

    if (isDateDisabled(date, commuteType, calendarType)) return false; // 이동 불가.

    setCurrentDate((prev) => {
      // 1월에서 이전 달로 가면 작년 12월로
      if (prev.month === 0) {
        return {
          year: prev.year - 1,
          month: 11,
        };
      }
      //  월만 감소
      return {
        year: prev.year,
        month: prev.month - 1,
      };
    });
    return true; // 이동 가능.
  };

  const goToNextMonth = (
    commuteType: CommuteType,
    calendarType = "customBooking",
    lastDayCanBook = ""
  ) => {
    let [year, month, day] = [currentDate.year, currentDate.month + 1, 1];
    if (currentDate.month > 11) {
      year = currentDate.year + 1;
      month = 0;
    }

    const date = new Date(year, month, day);

    if (calendarType === "fixedBusBooking") {
      // 예약 가능한 마지막 날짜가 다음 월보다 작으면 비활성화.
      // date가 마지막 날보다 크다면 false.
      
      return !(new Date(lastDayCanBook) < date);
    }

    if (isDateDisabled(date, commuteType, calendarType)) return false;

    setCurrentDate((prev) => {
      // 12월에서 다음 달로 가면 다음 년도 1월로
      if (prev.month === 11) {
        return {
          year: prev.year + 1,
          month: 0,
        };
      }
      // 그 외의 경우는 단순히 월만 증가
      return {
        year: prev.year,
        month: prev.month + 1,
      };
    });
    return true;
  };
  return { currentDate, goToPreviousMonth, goToNextMonth };
}
