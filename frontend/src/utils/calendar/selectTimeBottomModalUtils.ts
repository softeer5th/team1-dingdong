import { TimeSchedule } from "@/pages/BusBooking/store/types";
import { isDateDisabled } from "./calendarUtils";

interface allSameTimeOnSameWeekdayType {
  timeSchedule: TimeSchedule;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

// 모두 같은날에 같은 시각에 저장되어 있는지. 이 시각 요일 반복 여부 체크.
export const allSameTimeOnSameWeekday = ({
  timeSchedule,
  year,
  month,
  day,
  hour,
  minute,
}: allSameTimeOnSameWeekdayType): boolean => {
  const targetDate = new Date(year, month - 1, day);
  const targetWeekday = targetDate.getDay(); // 요일 (0: 일요일 ~ 6: 토요일)
  const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 총 날짜 수

  return Array.from({ length: daysInMonth }, (_, i) => i + 1) // 1부터 마지막 날짜까지 배열 생성
    .filter((d) => {
      const dateObject = new Date(year, month - 1, d);
      const weekday = dateObject.getDay();
      return weekday === targetWeekday && !isDateDisabled(dateObject, "등교");
    }) // 같은 요일만 필터링
    .every((d) => {
      const scheduledTime = timeSchedule[year]?.[month]?.[d];
      return (
        scheduledTime &&
        scheduledTime.hour === hour &&
        scheduledTime.minute === minute
      );
    });
};
