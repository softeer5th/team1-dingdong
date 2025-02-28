import { availableBookingMinDate, isDateDisabled, totalDaysInMonth } from "@/utils/calendar/calendarUtils";
import { useEffect, useState } from "react";
import { CommuteType } from "../types/commuteType";
import { getEarliestMonth } from "@/utils/fixedBusBooking/getEarliestMonthUtils";

// busTimeSchedule 함께타기 버스 스케줄 변수.
export default function useCalendar(calendarType: string = "customBooking", busTimeSchedule: string[] = []) {
  const dateInit = (() => {
    if (calendarType === "customBooking") {
      const minDateCanBooking = availableBookingMinDate();
      return {
        year: minDateCanBooking.getFullYear(),
        month: minDateCanBooking.getMonth(), //  (0: 1월, 1: 2월, ...)
      };
    } else {
      const now = new Date();
      const earliestMonthToBook = getEarliestMonth(busTimeSchedule);

      return {
        year: now.getFullYear(),
        month: earliestMonthToBook, //  (0: 1월, 1: 2월, ...)
      };
    }
  })();

  const [currentDate, setCurrentDate] = useState(dateInit);

  // // eslint-disable-next-line
  // debugger;


  // busTimeSchedule이 업데이트될 때 currentDate를 갱신
  useEffect(() => {
    if (calendarType === "fixed-bus-booking" && busTimeSchedule.length > 0) {
      const now = new Date();
      const earliestMonthToBook = getEarliestMonth(busTimeSchedule);
      console.log(earliestMonthToBook, "가장");
      setCurrentDate({
        year: now.getFullYear(),
        month: earliestMonthToBook, // (0: 1월, 1: 2월, ...)
      });
    }
  }, [busTimeSchedule]); // busTimeSchedule 변경 감지

  console.log(currentDate, "???");
  // 이전 달로 이동
  const goToPreviousMonth = (commuteType: CommuteType, calendarType = "customBooking") => {
    const daysInPrevMonth = totalDaysInMonth(currentDate.year, currentDate.month - 1);
    const lastDay = daysInPrevMonth; // date 객체를 만들기 위함.
    let [year, month] = [currentDate.year, currentDate.month - 1, daysInPrevMonth];

    if (currentDate.month < 0) {
      year = currentDate.year - 1;
      month = 11;
    }

    const date = new Date(year, month, lastDay);

    if (isDateDisabled(date, commuteType, calendarType)) return false; // 이동 불가.

    if (calendarType === "fixedBusBooking") {
      // 예약 가능한 이전 마지막 날짜의 월이 현재 월보다 작으면 비활성화.
      // date가 마지막 날보다 크다면 false.
      const earliestMonthToBook = getEarliestMonth(busTimeSchedule);

      const canGoPrev = earliestMonthToBook <= date.getMonth();

      if (canGoPrev) {
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
      }
      return canGoPrev;
    } else {
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
    }
    return true;
  };

  const goToNextMonth = (commuteType: CommuteType, calendarType = "customBooking", lastDayCanBook = "") => {
    const day = 1;
    let [year, month] = [currentDate.year, currentDate.month + 1, 1];
    if (currentDate.month > 11) {
      year = currentDate.year + 1;
      month = 0;
    }

    const date = new Date(year, month, day);
    if (isDateDisabled(date, commuteType, calendarType)) return false;
    if (calendarType === "fixedBusBooking") {
      // 예약 가능한 마지막 날짜가 다음 월보다 작으면 비활성화.
      // date가 마지막 날보다 크다면 false.
      if (isDateDisabled(date, commuteType, calendarType)) return false;
      const canGoNext = new Date(lastDayCanBook).getMonth() <= date.getMonth();
      if (canGoNext) {
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
        return canGoNext;
      }

      return true;
    } else {
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
    }

    return true;
  };
  return { currentDate, goToPreviousMonth, goToNextMonth };
}
